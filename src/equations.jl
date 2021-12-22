# New simplification rules
exponent_rules = [
    @rule(exp(log(~x)) => ~x),
    @acrule(exp(~x + ~y) => exp(~x) * exp(~y)),
    @acrule(exp(~x * ~y) => exp(~y)^~x),
]
rw_exp = RestartedChain(exponent_rules)
rw_chain = RestartedChain([SymbolicUtils.default_simplifier(),rw_exp])
rewriter = Postwalk(rw_chain)

# Constitutive relations
constitutive_relations(n::AbstractNode) = n.equations
function constitutive_relations(n::EqualEffort)
    if isempty(portconnections(n))
        return Equation[]
    end

    N = numports(m)
    @variables E[1:N](t) F[1:N](t)

    flow_constraint = [0 ~ sum(collect(F))]
    effort_constraints = [0 ~ E[1] - e for e in E[2:end]]
    return vcat(flow_constraint,effort_constraints)
end
function constitutive_relations(n::EqualFlow)
    if isempty(portconnections(n))
        return Equation[]
    end

    N = numports(n)
    @variables E[1:N](t) F[1:N](t)

    weighted_e = m.weights.*collect(E)
    weighted_f = m.weights.*collect(F)

    effort_constraint = [0 ~ sum(weighted_e)]
    flow_constraints = [0 ~ weighted_f[1] - f for f in weighted_f[2:end]]
    return vcat(effort_constraint,flow_constraints)
end
function cr(m::BondGraph)
    return simplify.(ModelingToolkit.equations(de_system(m)),rewriter=rewriter)
end
function constitutive_relations(bgn::BondGraphNode)
    return constitutive_relations(bgn.bondgraph)
end

@connector function MTKPort(;name)
    vars = @variables E(t) F(t)
    ODESystem(Equation[], t, vars, []; name=name)
end

ModelingToolkit.connect(::Type{MTKPort}, p1, p2) = 
    [0 ~ p1.F + p2.F, 0 ~ p1.E - p2.E]

function ModelingToolkit.ODESystem(n::AbstractNode)
    N = numports(n)
    ps = [MTKPort(name=Symbol("p$i")) for i in 1:N]

    @variables E[1:N](t) F[1:N](t)
    e_sub_rules = Dict(E[i] => ps[i].E for i in 1:N)
    f_sub_rules = Dict(F[i] => ps[i].F for i in 1:N)
    sub_rules = merge(e_sub_rules,f_sub_rules)
    eqs = [substitute(eq,sub_rules) for eq in cr(n)]

    sys = ODESystem(eqs, t, state_vars(n), params(n); 
                    name=n.name, defaults=default_value(n))
    return compose(sys, ps...)
end
function ModelingToolkit.ODESystem(m::BondGraph; simplify_eqs=true)
    subsystems = OrderedDict(c => ODESystem(c) for c in components(m))

    # Add constraints from bonds
    connections = Equation[]
    for (s,d) in bonds(m)
        src_port = getproperty(subsystems[s.node],Symbol("p$(s.index)"))
        dst_port = getproperty(subsystems[d.node],Symbol("p$(d.index)"))
        append!(connections,connect(src_port, dst_port))
    end
    
    @named _model = ODESystem(connections,t; name=m.name)
    model = compose(_model,collect(values(subsystems)))

    if simplify_eqs
        simplified_model = structural_simplify(model)
        simplified_eqs = simplify.(ModelingToolkit.equations(simplified_model); expand=true, rewriter=rewriter)
        # '@set!' allows mutation of an immutable field 
        @set! simplified_model.eqs = simplified_eqs
        return simplified_model
    else
        return initialize_system_structure(model)
    end
end

# equations(bg::BondGraph; simplify_eqs = true) =
#     ModelingToolkit.equations(ODESystem(bg; simplify_eqs))

function simulate(m::BondGraph, tspan; u0 = [], pmap = [], probtype::Symbol = :ODE, kwargs...)
    sys = ODESystem(m)
    flag_ODE = !any([isequal(eq.lhs,0) for eq in ModelingToolkit.equations(sys)])
    if probtype==:ODE || flag_ODE
        prob = ODEProblem(sys, u0, tspan, pmap)
    else
        prob = ODAEProblem(sys, u0, tspan, pmap)
    end
    return solve(prob; kwargs...)
end

==(sym1::T, sym2::T) where T <: SymbolicUtils.Symbolic{Real} = (simplify(sym1) - simplify(sym2)) == 0