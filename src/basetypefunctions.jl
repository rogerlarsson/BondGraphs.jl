# Vertex
vertex(n::AbstractNode) = n.vertex[]
set_vertex!(n::AbstractNode, v::Int) = n.vertex[] = v

# Ports
freeports(n::AbstractNode) = n.freeports
freeports(::Junction) = [true]
numports(n::AbstractNode) = length(n.freeports)
numports(::Junction) = Inf
updateport!(n::AbstractNode, idx::Int) = freeports(n)[idx] = !freeports(n)[idx]
nextfreeport(n::AbstractNode) = findfirst(freeports(n))

# Nodes in Bonds
srcnode(b::Bond) = b.src.node
dstnode(b::Bond) = b.dst.node
in(n::AbstractNode, b::Bond) = n === srcnode(b) || n === dstnode(b)

# Searching
getnodes(bg::BondGraph, t::Symbol) = filter(x -> x.type == t, bg.nodes)
getnodes(bg::BondGraph, n::AbstractString) = filter(x -> x.name == n, bg.nodes)

getbonds(bg::BondGraph, t::Tuple) = getbonds(bg, t[1], t[2])
getbonds(bg::BondGraph, node1::AbstractNode, node2::AbstractNode) = filter(b -> node1 in b && node2 in b, bg.bonds)

# I/O
show(io::IO, node::AbstractNode) = print(io, "$(node.type):$(node.name)")
show(io::IO, node::Junction) = print(io, "$(node.type)")
show(io::IO, port::Port) = print(io, "Port $(port.node) ($(port.index))")
show(io::IO, b::Bond) = print(io, "Bond $(srcnode(b)) ⇀ $(dstnode(b))")
show(io::IO, bg::BondGraph) = print(io, "BondGraph $(bg.name) ($(lg.nv(bg)) Nodes, $(lg.ne(bg)) Bonds)")

# Comparisons
# These definitions will need to expand when equations etc. are added
==(n1::AbstractNode, n2::AbstractNode) = n1.type == n2.type && n1.name == n2.name
# bondgraph comparison

# Mapping
# TODO - function which creates map of components and bonds to indices

# Easier referencing systems using a.b notation
# TODO create tests
function getproperty(bg::BondGraph, sym::Symbol)
    # Calling getfield explicitly avoids using "a.b" 
    # and causing a StackOverflowError
    allnodes = getfield(bg, :nodes)
    names = [getfield(n, :name) for n in allnodes]
    symnodes = allnodes[names .== string(sym)]
    if isempty(symnodes)
        return getfield(bg, sym)
    elseif length(symnodes) == 1
        return symnodes[1]
    else
        return symnodes
    end
end

function getproperty(bgn::BondGraphNode, sym::Symbol)
    bg = getfield(bgn, :bondgraph)
    try 
        return getproperty(bg, sym)
    catch
        return getfield(bgn, sym)
    end
end