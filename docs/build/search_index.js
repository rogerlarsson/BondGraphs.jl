var documenterSearchIndex = {"docs":
[{"location":"gettingstarted/#Getting-Started","page":"Getting Started","title":"Getting Started","text":"","category":"section"},{"location":"gettingstarted/","page":"Getting Started","title":"Getting Started","text":"This example runs through the basic steps of building and simulating a bond graph model. For a full list of functions refer to the API Reference.","category":"page"},{"location":"gettingstarted/","page":"Getting Started","title":"Getting Started","text":"using BondGraphs\r\nusing Latexify","category":"page"},{"location":"gettingstarted/","page":"Getting Started","title":"Getting Started","text":"Our first example will be a simple electric circuit of a capacitor, resistor, and current supply in parallel. We will first model this circuit without the current supply.","category":"page"},{"location":"gettingstarted/","page":"Getting Started","title":"Getting Started","text":"(Image: )","category":"page"},{"location":"gettingstarted/#Bond-graph-construction","page":"Getting Started","title":"Bond graph construction","text":"","category":"section"},{"location":"gettingstarted/","page":"Getting Started","title":"Getting Started","text":"We first create a BondGraph object which will hold all our components. This is an empty object that will soon be populated with components and bonds.","category":"page"},{"location":"gettingstarted/","page":"Getting Started","title":"Getting Started","text":"model = BondGraph(\"RC Circuit\")","category":"page"},{"location":"gettingstarted/","page":"Getting Started","title":"Getting Started","text":"Next we will create a capacitor as a bond graph 'C'-component. The component type's description can be printed for extra information.","category":"page"},{"location":"gettingstarted/","page":"Getting Started","title":"Getting Started","text":"C = Component(:C)\r\ndescription(:C)","category":"page"},{"location":"gettingstarted/","page":"Getting Started","title":"Getting Started","text":"Available component types are defined in the DEFAULT_LIBRARY.","category":"page"},{"location":"gettingstarted/","page":"Getting Started","title":"Getting Started","text":"print(keys(BondGraphs.DEFAULT_LIBRARY))","category":"page"},{"location":"gettingstarted/","page":"Getting Started","title":"Getting Started","text":"We next create a resistor 'R'-component and an EqualEffort node which represents Kirchoff's Voltage Law. In bond graph terminology, 0-Junctions are EqualEffort nodes, and 1-Junctions are EqualFlow nodes.","category":"page"},{"location":"gettingstarted/","page":"Getting Started","title":"Getting Started","text":"R = Component(:R)\r\nkvl = EqualEffort()","category":"page"},{"location":"gettingstarted/","page":"Getting Started","title":"Getting Started","text":"Components and nodes are added to the model, and connected together as a graph network. Note that components must first be added to the model before they can be connected.","category":"page"},{"location":"gettingstarted/","page":"Getting Started","title":"Getting Started","text":"add_node!(model, [C, R, kvl])\r\nconnect!(model, R, kvl)\r\nconnect!(model, C, kvl)\r\nmodel","category":"page"},{"location":"gettingstarted/","page":"Getting Started","title":"Getting Started","text":"Because our bond graph is fundamentally a graph, we can using existing graph methods on our model.","category":"page"},{"location":"gettingstarted/","page":"Getting Started","title":"Getting Started","text":"using Graphs\r\nincidence_matrix(model)","category":"page"},{"location":"gettingstarted/","page":"Getting Started","title":"Getting Started","text":"We can also visualise our model structure by plotting it as a graph network using Plots.jl.","category":"page"},{"location":"gettingstarted/","page":"Getting Started","title":"Getting Started","text":"using Plots\r\nplot(model)","category":"page"},{"location":"gettingstarted/#Simulating-our-model","page":"Getting Started","title":"Simulating our model","text":"","category":"section"},{"location":"gettingstarted/","page":"Getting Started","title":"Getting Started","text":"With a bond graph we can automatically generate a series of differential equations which combine all the constitutive relations from the components, with efforts and flows shared according to the graph structure.","category":"page"},{"location":"gettingstarted/","page":"Getting Started","title":"Getting Started","text":"constitutive_relations(model)","category":"page"},{"location":"gettingstarted/","page":"Getting Started","title":"Getting Started","text":"We will set values for the component parameters in the model. Each component comes with default values. When substituted into our equations, we get the following relation for the capacitor charge C.q(t).","category":"page"},{"location":"gettingstarted/","page":"Getting Started","title":"Getting Started","text":"C.C = 1\r\nR.R = 2\r\nconstitutive_relations(model; sub_defaults=true)","category":"page"},{"location":"gettingstarted/","page":"Getting Started","title":"Getting Started","text":"We can solve this bond graph directly using the in-built simulate function.","category":"page"},{"location":"gettingstarted/","page":"Getting Started","title":"Getting Started","text":"tspan = (0., 10.)\r\nu0 = [1] # initial value for C.q(t)\r\nsol = simulate(model, tspan; u0)\r\nplot(sol)","category":"page"},{"location":"gettingstarted/","page":"Getting Started","title":"Getting Started","text":"Under the hood, our simulate function is converting our bond graph into an ModelingToolkit.ODESystem. We can chose instead to create an ODESystem directly and handle it with whatever functions we like.","category":"page"},{"location":"gettingstarted/#Adding-control-variables","page":"Getting Started","title":"Adding control variables","text":"","category":"section"},{"location":"gettingstarted/","page":"Getting Started","title":"Getting Started","text":"We will expand our model by adding an external current (flow) supply in parallel, represented by the component Sf (Source of Flow)","category":"page"},{"location":"gettingstarted/","page":"Getting Started","title":"Getting Started","text":"Is = Component(:Sf, \"Is\")\r\nadd_node!(model, Is)\r\nconnect!(model, Is, kvl)\r\nplot(model)","category":"page"},{"location":"gettingstarted/","page":"Getting Started","title":"Getting Started","text":"We will add a the forcing function fs(t) = sin(2t) as an external current input.","category":"page"},{"location":"gettingstarted/","page":"Getting Started","title":"Getting Started","text":"Is.fs = t -> sin(2t)\r\nconstitutive_relations(model; sub_defaults=true)","category":"page"},{"location":"gettingstarted/","page":"Getting Started","title":"Getting Started","text":"sol = simulate(model, tspan; u0)\r\nplot(sol)","category":"page"},{"location":"gettingstarted/","page":"Getting Started","title":"Getting Started","text":"The input can be any arbitrary julia function of t, so long as it returns a sensible output. Note that for this to work you must register the custom function with @register_symbolic, so that the library knows not to simplify this function further.","category":"page"},{"location":"gettingstarted/","page":"Getting Started","title":"Getting Started","text":"using ModelingToolkit\r\n@register_symbolic f(t)\r\nIs.fs = t -> f(t)\r\n\r\nf(t) = t % 2 <= 1 ? 0 : 1 # repeating square wave\r\nsol = simulate(model, tspan; u0)\r\nplot(sol)","category":"page"},{"location":"api/#Reference","page":"API Reference","title":"Reference","text":"","category":"section"},{"location":"api/","page":"API Reference","title":"API Reference","text":"","category":"page"},{"location":"api/#Types","page":"API Reference","title":"Types","text":"","category":"section"},{"location":"api/","page":"API Reference","title":"API Reference","text":"Modules = [BondGraphs]\r\nOrder = [:type]","category":"page"},{"location":"api/#BondGraphs.Bond","page":"API Reference","title":"BondGraphs.Bond","text":"Bond(source::AbstractNode, destination::AbstractNode)\nBond(source::Port, destination::Port)\n\nConnect two bond graph components (or two ports of two components) with a bond. The bond direction is from source to destination. If the ports are not specified, the bond will be created between the next available ports in each component.\n\nIn most cases it is better to use connect! instead.\n\n\n\n\n\n","category":"type"},{"location":"api/#BondGraphs.BondGraph","page":"API Reference","title":"BondGraphs.BondGraph","text":"BondGraph(name=\"BG\") <: Graphs.AbstractGraph{Int64}\nBondGraph(name, nodes::Vector{AbstractNode}, bonds::Vector{Bond})\n\nThe bond graph object which contains a vector of nodes and bonds. All operations on components or bonds must happen within the same bond graph. This inherits the methods of the AbstractGraph type and so will work with\n\nSee also BondGraphNode.\n\n\n\n\n\n","category":"type"},{"location":"api/#BondGraphs.BondGraph-Tuple{Catalyst.ReactionSystem}","page":"API Reference","title":"BondGraphs.BondGraph","text":"BondGraph(rs::ReactionSystem; chemostats=[])\n\nConvert a Catalyst.ReactionSystem into a BondGraph.\n\nchemostats are chemical species with fixed concentrations. In bond graph terms, these are \"SCe\" types (chemical energy sources) instead of \"Ce\" types (chemical energy store).\n\n\n\n\n\n","category":"method"},{"location":"api/#BondGraphs.BondGraphNode","page":"API Reference","title":"BondGraphs.BondGraphNode","text":"BondGraphNode(bg::BondGraph, name=name(bg); deepcopy=false)\n\nConvert a BondGraph into a component that can be added in another level bond graph. Componets can be exposed to the outer bond graph by replacing them with a SourceSensor type using the swap! function.\n\nSee also BondGraph.\n\n\n\n\n\n","category":"type"},{"location":"api/#BondGraphs.Component","page":"API Reference","title":"BondGraphs.Component","text":"Component{N} <: AbstractNode\nComponent(type, name=type)\nComponent(type, name=type; library=BondGraphs.DEFAULT_LIBRARY, <keyword arguments>)\n\nConstruct a Component of a defined (bondgraph) type ∈ {R, C, I, Se, Sf, TF, Ce, Re, SCe}.\n\nComponents have a N fixed ports when generated. This is usually determined by the bond graph type. Other properties and equations of available components are defined in BondGraphs.DEFAULT_LIBRARY (see  description).\n\n\n\n\n\n","category":"type"},{"location":"api/#BondGraphs.EqualEffort","page":"API Reference","title":"BondGraphs.EqualEffort","text":"EqualEffort <: Junction\n\nEfforts are all equal, flows sum to zero (0-junction).\n\n\n\n\n\n","category":"type"},{"location":"api/#BondGraphs.EqualFlow","page":"API Reference","title":"BondGraphs.EqualFlow","text":"EqualFlow <: Junction\n\nFlows are all equal, efforts sum to zero (1-junction).\n\n\n\n\n\n","category":"type"},{"location":"api/#BondGraphs.Port","page":"API Reference","title":"BondGraphs.Port","text":"Port(node::AbstractNode)\nPort(node::AbstractNode, index::Int)\n\nCreate a new Port for node. Ports have an index corresponding to the component's variables.\n\nPorts are the node elements that are connected by bonds. The port does not technically exist until this is called, even though a component has a fixed number of assigned ports when created.\n\nWARNING: connecting a bond to the wrong port may assign values to the wrong variables!\n\n\n\n\n\n","category":"type"},{"location":"api/#BondGraphs.SourceSensor","page":"API Reference","title":"BondGraphs.SourceSensor","text":"SourceSensor <: AbstractNode\n\nSpecial component type that acts as a source of both effort and flow.\n\n\n\n\n\n","category":"type"},{"location":"api/#Methods","page":"API Reference","title":"Methods","text":"","category":"section"},{"location":"api/","page":"API Reference","title":"API Reference","text":"Modules = [BondGraphs]\r\nOrder = [:function]","category":"page"},{"location":"api/#BondGraphs.add_node!-Tuple{BondGraph, Any}","page":"API Reference","title":"BondGraphs.add_node!","text":"add_node!(bg::BondGraph, nodes)\n\nAdd a node to a bond graph bg. Can add a single node or list of nodes.\n\n\n\n\n\n","category":"method"},{"location":"api/#BondGraphs.addlibrary!-Tuple{Any}","page":"API Reference","title":"BondGraphs.addlibrary!","text":"addlibrary!(newlib)\n\nCombine the library newlib with the default library used within BondGraphs. newlib will need to be in the form of a dictionary, and new components should follow the below schema.\n\nNOTE: This library is likely to change in the future. Do not rely on this schema too much.\n\nLibrary Schema\n\ndescription -> written description of the component and definitions\nnumports -> the number of ports in the component\nvariables ->\nparameters -> constant parameters, unique for each component instance\nglobals -> global parameters (i.e. no namespace)\nstates -> time-dependent state variables\ncontrols -> time-dependent parameters that can accept julia functions\nequations -> symbolic description of the constitutive equations\n\n\n\n\n\n","category":"method"},{"location":"api/#BondGraphs.connect!-Tuple{BondGraph, AbstractNode, AbstractNode}","page":"API Reference","title":"BondGraphs.connect!","text":"connect!(bg::BondGraph, srcnode, dstnode)\nconnect!(bg::BondGraph, srcnode, dstnode; srcportindex, dstportindex)\n\nConnect two components together in the same bond graph. The bond direction is always from srcnode to dstnode. The port index of srcnode and dstnode can be optionally set.\n\n\n\n\n\n","category":"method"},{"location":"api/#BondGraphs.constitutive_relations-Tuple{AbstractNode}","page":"API Reference","title":"BondGraphs.constitutive_relations","text":"constitutive_relations(n::AbstractNode)\n\nReturn the constitutive relations (equations) for node n.\n\nIf n is a Junction, the flow and effort constraints are generated from its connections.\n\n\n\n\n\n","category":"method"},{"location":"api/#BondGraphs.constitutive_relations-Tuple{BondGraph}","page":"API Reference","title":"BondGraphs.constitutive_relations","text":"constitutive_relations(bg::BondGraph; sub_defaults=false)\n\nGenerate the constitutive relations (equations) for bond graph bg.\n\nThe equations are symbolically derived from the equations of all the nodes and bonds in the bond graph. If sub_defaults is true, the default parameter values for each component are subbed into the equations.\n\nNOTE: This creates a ModelingToolkit.ODESystem of the bond graph and returns only the equations. If you want to numerically solve the bond graph equations, either use simulate or create an ODESystem directly.\n\n\n\n\n\n","category":"method"},{"location":"api/#BondGraphs.description-Tuple{Symbol}","page":"API Reference","title":"BondGraphs.description","text":"description(comp::Symbol)\ndescription(lib, comp::Symbol)\n\nPrint the description of the component with symbol comp in library lib.\n\n\n\n\n\n","category":"method"},{"location":"api/#BondGraphs.disconnect!-Tuple{BondGraph, AbstractNode, AbstractNode}","page":"API Reference","title":"BondGraphs.disconnect!","text":"disconnect!(bg::BondGraph, node1, node2)\n\nRemove the bond connecting node1 and node2. The order of nodes does not matter.\n\n\n\n\n\n","category":"method"},{"location":"api/#BondGraphs.getbonds-Tuple{BondGraph, Tuple}","page":"API Reference","title":"BondGraphs.getbonds","text":"getbonds(bg::BondGraph, n1::AbstractNode, n2::AbstractNode)\ngetbonds(bg::BondGraph, (n1, n2))\n\nReturn the bond in bg connecting nodes n1 and n2, if it exists.\n\n\n\n\n\n","category":"method"},{"location":"api/#BondGraphs.getnodes-Tuple{BondGraph, DataType}","page":"API Reference","title":"BondGraphs.getnodes","text":"getnodes(bg::BondGraph, type)\n\nReturn all nodes a particular bond graph type in the bond graph bg.\n\ntype can be a DataType (e.g. Component{1}), a string (e.g. \"C\"), or a vector of strings.\n\n\n\n\n\n","category":"method"},{"location":"api/#BondGraphs.insert_node!-Tuple{BondGraph, Bond, AbstractNode}","page":"API Reference","title":"BondGraphs.insert_node!","text":"insert_node!(bg::BondGraph, bond, newnode)\ninsert_node!(bg::BondGraph, (node1, node2), newnode)\n\nInserts newnode between two existing connected nodes. The direction of the original bond is preserved.\n\nSupply either the two nodes as a tuple, or the bond that connects them in bg.\n\n\n\n\n\n","category":"method"},{"location":"api/#BondGraphs.merge_nodes!-Tuple{BondGraph, AbstractNode, AbstractNode}","page":"API Reference","title":"BondGraphs.merge_nodes!","text":"merge_nodes!(bg::BondGraph, node1, node2; junction=EqualEffort())\n\nCombine two copies of the same component in bg by adding a junction and connecting the neighbours of node1 and node2 to the new junction.\n\nMerging nodes this way means there is only one component representing a system element, and all other nodes connect to the component via the new junction.\n\n\n\n\n\n","category":"method"},{"location":"api/#BondGraphs.remove_node!-Tuple{BondGraph, Any}","page":"API Reference","title":"BondGraphs.remove_node!","text":"remove_node!(bg::BondGraph, nodes)\n\nRemove a node to a bond graph bg. Can remove a single node or list of nodes.\n\n\n\n\n\n","category":"method"},{"location":"api/#BondGraphs.simplify_junctions!-Tuple{BondGraph}","page":"API Reference","title":"BondGraphs.simplify_junctions!","text":"simplify_junctions!(bg::BondGraph; remove_redundant=true, squash_identical=true)\n\nRemove unnecessary or redundant Junctions from bond graph bg.\n\nIf remove_redundant is true, junctions that have zero or one neighbours are removed, and junctions with two neighbours are squashed (connected components remain connected).\n\nIf squash_identical is true, connected junctions of the same type are squashed into a single junction.\n\n\n\n\n\n","category":"method"},{"location":"api/#BondGraphs.simulate-Tuple{BondGraph, Any}","page":"API Reference","title":"BondGraphs.simulate","text":"simulate(bg::BondGraph, tspan; u0=[], pmap=[], solver=Tsit5(), flag_ODE=true, kwargs...)\n\nSimulate the bond graph model.\n\nThe keyword arguments are the same as for ODEProblem and solve in DifferentialEquations.\n\n\n\n\n\n","category":"method"},{"location":"api/#BondGraphs.swap!-Tuple{BondGraph, AbstractNode, AbstractNode}","page":"API Reference","title":"BondGraphs.swap!","text":"swap!(bg::BondGraph, oldnode, newnode)\n\nRemove oldnode from bond graph bg and replace it with newnode. The new node will have the same connections (bonds) as the original model.\n\nnewnode must have a greater or equal number of ports as oldnode.\n\n\n\n\n\n","category":"method"},{"location":"examples/#Examples","page":"Examples","title":"Examples","text":"","category":"section"},{"location":"examples/","page":"Examples","title":"Examples","text":"Interactive Jupyter Notebook versions of these tutorials can be found on GitHub.","category":"page"},{"location":"examples/","page":"Examples","title":"Examples","text":"using BondGraphs\r\nusing Catalyst\r\nusing Plots","category":"page"},{"location":"examples/#Simple-Electric-Circuit","page":"Examples","title":"Simple Electric Circuit","text":"","category":"section"},{"location":"examples/","page":"Examples","title":"Examples","text":"This is a reduced copy-and-paste version of the electric circuit tutorial in the Getting Started section.","category":"page"},{"location":"examples/","page":"Examples","title":"Examples","text":"(Image: )","category":"page"},{"location":"examples/","page":"Examples","title":"Examples","text":"using BondGraphs\r\nusing Plots","category":"page"},{"location":"examples/","page":"Examples","title":"Examples","text":"model = BondGraph(\"RC Circuit\")\r\nC = Component(:C)\r\nR = Component(:R)\r\nIs = Component(:Sf, \"Is\")\r\nkvl = EqualEffort()\r\n\r\nadd_node!(model, [C, R, Is, kvl])\r\nconnect!(model, R, kvl)\r\nconnect!(model, C, kvl)\r\nconnect!(model, Is, kvl)\r\n\r\nC.C = 1\r\nR.R = 2\r\n\r\nu0 = [1]\r\np = plot()\r\nfor i in 1:4\r\n    Is.fs = t -> cos(i * t)\r\n    sol = simulate(model, (0., 5.); u0)\r\n    plot!(p, sol, label = \"f(t) = cos($(i)t)\", lw=2)\r\nend\r\nplot(p)","category":"page"},{"location":"examples/#Biochemical-Reaction-Networks","page":"Examples","title":"Biochemical Reaction Networks","text":"","category":"section"},{"location":"examples/","page":"Examples","title":"Examples","text":"BondGraphs.jl includes a special type conversion from a Catalyst.ReactionSystem to a BondGraph. This means we can easily create chemical reaction networks with the @reaction_network macro and automatically generate a biochemical bond graph.","category":"page"},{"location":"examples/","page":"Examples","title":"Examples","text":"using BondGraphs\r\nusing Catalyst\r\nusing Plots","category":"page"},{"location":"examples/#A-simple-biochemical-example","page":"Examples","title":"A simple biochemical example","text":"","category":"section"},{"location":"examples/","page":"Examples","title":"Examples","text":"We will start with a very simple chemical reaction.","category":"page"},{"location":"examples/","page":"Examples","title":"Examples","text":"A + B rightleftharpoons C","category":"page"},{"location":"examples/","page":"Examples","title":"Examples","text":"Due to the design of bond graphs, all reactions must be reversible. ","category":"page"},{"location":"examples/","page":"Examples","title":"Examples","text":"abc = @reaction_network ABC begin\r\n    1, A + B --> C\r\nend\r\n\r\nbg_abc = BondGraph(abc)\r\nplot(bg_abc)","category":"page"},{"location":"examples/","page":"Examples","title":"Examples","text":"note: Note\nThe 1 before the reaction definition is the reaction rate. This is currently not used in the conversion, so the value is only a placeholder. The reaction rate can be set later in the bond graph. ","category":"page"},{"location":"examples/","page":"Examples","title":"Examples","text":"This model derives equations for mass-action kinetics. (Other reaction equations can be used with a custom reaction component.)","category":"page"},{"location":"examples/","page":"Examples","title":"Examples","text":"constitutive_relations(bg_abc; sub_defaults=true)","category":"page"},{"location":"examples/","page":"Examples","title":"Examples","text":"tspan = (0., 2.)\r\nu0 = [1, 1, 0]\r\nsol = simulate(bg_abc, tspan; u0)\r\nplot(sol, lw=3)","category":"page"},{"location":"examples/#Stoichiometry","page":"Examples","title":"Stoichiometry","text":"","category":"section"},{"location":"examples/","page":"Examples","title":"Examples","text":"This process works with multiple reactions with different stoichiometries.","category":"page"},{"location":"examples/","page":"Examples","title":"Examples","text":"A + 2B rightleftharpoons 3C \r\n8A + 4C rightleftharpoons D","category":"page"},{"location":"examples/","page":"Examples","title":"Examples","text":"abcd = @reaction_network ABCD begin\r\n    1, A + 2B --> 3C\r\n    1, 8A + 4C --> D\r\nend\r\nbg_abcd = BondGraph(abcd)\r\nplot(bg_abcd)","category":"page"},{"location":"examples/","page":"Examples","title":"Examples","text":"constitutive_relations(bg_abcd; sub_defaults=true)","category":"page"},{"location":"examples/","page":"Examples","title":"Examples","text":"tspan = (0.0, 0.1)\r\nu0 = [3, 2, 1, 0]\r\nsol = simulate(bg_abcd, tspan; u0)\r\nplot(sol, lw=3)","category":"page"},{"location":"examples/#The-reversible-Michaelis-Menten-model","page":"Examples","title":"The reversible Michaelis-Menten model","text":"","category":"section"},{"location":"examples/","page":"Examples","title":"Examples","text":"A realistic example with chemostats. Chemostats are chemical species that are held constant throught the reaction by adding or removing the species to maintian the set concentration.","category":"page"},{"location":"examples/","page":"Examples","title":"Examples","text":"E + S rightleftharpoons C  \r\nC rightleftharpoons E + P","category":"page"},{"location":"examples/","page":"Examples","title":"Examples","text":"Here, the substrate S and P are chemostats. In bond graph terms, this means replacing the Ce components with a SCe component.","category":"page"},{"location":"examples/","page":"Examples","title":"Examples","text":"rn_mm = @reaction_network MM_reversible begin\r\n    (1, 1), E + S <--> C\r\n    (1, 1), C <--> E + P\r\nend\r\n\r\nbg_mm = BondGraph(rn_mm; chemostats=[\"S\", \"P\"])\r\n\r\nplot(bg_mm, fontsize=12)","category":"page"},{"location":"examples/","page":"Examples","title":"Examples","text":"bg_mm.S.xs = t -> 1 + t # substrate increases over time\r\n\r\ntspan = (0., 10.)\r\nu0 = [1,2]\r\nsol = simulate(bg_mm, tspan; u0)\r\nplot(sol, lw=3)","category":"page"},{"location":"examples/#SERCA-Pump","page":"Examples","title":"SERCA Pump","text":"","category":"section"},{"location":"examples/","page":"Examples","title":"Examples","text":"In this example we will demonstrate biochemical bond graph construction on a larger system.","category":"page"},{"location":"examples/","page":"Examples","title":"Examples","text":"We will model the SERCA reaction network as described in Tran et al.[1] and Pan et al.[2]","category":"page"},{"location":"examples/","page":"Examples","title":"Examples","text":"[1]: Tran et al., A Thermodynamic Model of the Cardiac Sarcoplasmic/Endoplasmic Ca2+ (SERCA) Pump (2009)","category":"page"},{"location":"examples/","page":"Examples","title":"Examples","text":"[2]: Pan et al., Bond graph modelling of the cardiac action potential: implications for drift and non-unique steady states (2018)","category":"page"},{"location":"examples/","page":"Examples","title":"Examples","text":"(Image: )","category":"page"},{"location":"examples/","page":"Examples","title":"Examples","text":"using BondGraphs\r\nusing Catalyst\r\nusing Plots","category":"page"},{"location":"examples/","page":"Examples","title":"Examples","text":"rn_serca = @reaction_network SERCA begin\r\n    (1, 1), P1 + MgATP <--> P2\r\n    (1, 1), P2 + H <--> P2a\r\n    (1, 1), P2 + 2Cai <--> P4\r\n    (1, 1), P4 <--> P5 + 2H\r\n    (1, 1), P5 <--> P6 + MgADP\r\n    (1, 1), P6 <--> P8 + 2Casr\r\n    (1, 1), P8 + 2H <--> P9\r\n    (1, 1), P9 <--> P10 + H\r\n    (1, 1), P10 <--> P1 + Pi\r\nend\r\n\r\nchemostats = [\"MgATP\", \"MgADP\", \"Pi\", \"H\", \"Cai\", \"Casr\"]\r\nbg_serca = BondGraph(rn_serca; chemostats)\r\nplot(bg_serca, size=(600,600), fontsize=10)","category":"page"},{"location":"examples/","page":"Examples","title":"Examples","text":"For this example we need to set the parameter values for the reaction rates r, the species affinities K, the chemostat concentrations x_s, and the initial concentrations for all P_i.","category":"page"},{"location":"examples/","page":"Examples","title":"Examples","text":"We also set let the calcium concentration increase over time with textCa^2+ = 005 + 001t","category":"page"},{"location":"examples/","page":"Examples","title":"Examples","text":"reaction_rates = [\r\n    :R1 => 0.00053004, \r\n    :R2 => 8326784.0537,\r\n    :R3 => 1567.7476,\r\n    :R4 => 1567.7476,\r\n    :R5 => 3063.4006,\r\n    :R6 => 130852.3839,\r\n    :R7 => 11612934.8748,\r\n    :R8 => 11612934.8748,\r\n    :R9 => 0.049926\r\n]\r\nspecies_affinities = [\r\n    :P1 => 5263.6085,\r\n    :P2 => 3803.6518,\r\n    :P2a => 3110.4445,\r\n    :P4 => 16520516.1239,\r\n    :P5 => 0.82914,\r\n    :P6 => 993148.433,\r\n    :P8 => 37.7379,\r\n    :P9 => 2230.2717,\r\n    :P10 => 410.6048,\r\n    :Cai => 1.9058,\r\n    :Casr => 31.764,\r\n    :MgATP => 244.3021,\r\n    :MgADP => 5.8126e-7,\r\n    :Pi => 0.014921,\r\n    :H => 1862.5406\r\n]\r\nvol_sr = 2.28\r\nchemostat_amounts = [\r\n    :Cai => t -> 0.0057,\r\n    :Casr => t -> vol_sr*(0.05 + 0.01t), # Ca2+ increases over time\r\n    :H => t -> 0.004028,\r\n    :MgADP => t -> 1.3794,\r\n    :MgATP => t -> 3.8,\r\n    :Pi => t -> 570\r\n]\r\ninitial_conditions = [\r\n    :P1 => 0.000483061870385487,\r\n    :P2 => 0.0574915174273067,\r\n    :P2a => 0.527445119834607,\r\n    :P4 => 1.51818391164022e-09,\r\n    :P5 => 0.000521923287622898,\r\n    :P6 => 7.80721128535043e-05,\r\n    :P8 => 0.156693953834181,\r\n    :P9 => 0.149232225342376,\r\n    :P10 => 0.108044124948978\r\n]\r\nfor (reaction, rate) in reaction_rates\r\n    getproperty(bg_serca, reaction).r = rate\r\nend\r\nfor (species, affinity) in species_affinities\r\n    getproperty(bg_serca, species).K = affinity\r\nend\r\nfor (chemostat, amount) in chemostat_amounts\r\n    getproperty(bg_serca, chemostat).xs = amount\r\nend\r\nfor (species, ic) in initial_conditions\r\n    getproperty(bg_serca, species).q = ic\r\nend","category":"page"},{"location":"examples/","page":"Examples","title":"Examples","text":"import DifferentialEquations: Rosenbrock23 # stiff equation solver\r\n\r\ntspan = (0., 200.)\r\nsol = simulate(bg_serca, tspan; solver=Rosenbrock23());\r\nplot(sol, lw=2, legend=:right)","category":"page"},{"location":"examples/#Electrochemical-System-Ion-Transport","page":"Examples","title":"Electrochemical System - Ion Transport","text":"","category":"section"},{"location":"examples/","page":"Examples","title":"Examples","text":"A multiphysics bond graph example that combines biochemical reactions with electrical (ion) forces. This example is taken from Cudmore et al.[3]","category":"page"},{"location":"examples/","page":"Examples","title":"Examples","text":"[3]: Cudmore et al., Analysing and simulating energy-based models in biology using BondGraphTools (2021)","category":"page"},{"location":"examples/","page":"Examples","title":"Examples","text":"For this example we are modelling three ion pore channels for Na<sup>+</sup>, Cl<sup>-</sup> and K<sup>+</sup>. It is therefore a good idea to define a function that returns an ion pore base model.","category":"page"},{"location":"examples/","page":"Examples","title":"Examples","text":"using BondGraphs\r\nusing Plots","category":"page"},{"location":"examples/","page":"Examples","title":"Examples","text":"function ion_pore(name=\"\"; z=1, conc_ex=1//1000, conc_in=1//1000)\r\n    bg = BondGraph(name * \" Ion Transport\")\r\n\r\n    membrane = Component(:C, \"mem\"; C=1)\r\n    ion_ex = Component(:SCe, \"Ie\"; K=1, xs=t->conc_ex)\r\n    ion_in = Component(:SCe, \"Ii\"; K=1, xs=t->conc_in)\r\n\r\n    potential_mem = EqualEffort()\r\n    flow_f = EqualFlow()\r\n    flow_r = EqualFlow()\r\n\r\n    TF_F = Component(:TF, \"F\"; n=96485)\r\n    TF_zf = Component(:TF, \"-z/2\"; n=-z//2) # -ve voltage\r\n    TF_zr = Component(:TF, \"z/2\"; n=z//2) # +ve voltage\r\n\r\n    re_pore = Component(:Re, \"pore\"; r=1//10_000_000)\r\n\r\n    allcomps = [\r\n        membrane, ion_ex, ion_in, potential_mem, flow_f, flow_r,\r\n        TF_F, TF_zr, TF_zf, re_pore\r\n    ]\r\n\r\n    add_node!(bg, allcomps)\r\n    connect!(bg, ion_ex, flow_f)\r\n    connect!(bg, flow_f, re_pore)\r\n    connect!(bg, re_pore, flow_r)\r\n    connect!(bg, flow_r, ion_in)\r\n    connect!(bg, flow_r, TF_zr, dstportindex=2)\r\n    connect!(bg, TF_zr, potential_mem, srcportindex=1)\r\n    connect!(bg, potential_mem, TF_zf, dstportindex=1)\r\n    connect!(bg, TF_zf, flow_f, srcportindex=2)\r\n    connect!(bg, potential_mem, TF_F, dstportindex=2)\r\n    connect!(bg, TF_F, membrane, srcportindex=1)\r\n    \r\n    return bg\r\nend\r\nion_pore_bg = ion_pore()\r\nplot(ion_pore_bg)","category":"page"},{"location":"examples/","page":"Examples","title":"Examples","text":"ions = [\r\n    \"Na\" => (z=1, conc_ex=155//1000, conc_in=19//1000),\r\n    \"Cl\" => (z=-1, conc_ex=112//1000, conc_in=78//1000),\r\n    \"K\"  => (z=1, conc_ex=5//1000, conc_in=136//1000),\r\n]\r\n\r\nplot(; legend=:bottomright)\r\nfor (ionname, params) in ions\r\n    model = ion_pore(ionname; params...)\r\n    sol = simulate(model, (0., 1000.))\r\n    plot!(sol, label=ionname, lw=3)\r\nend\r\nplot!(; xlabel=\"Time [ms]\", ylabel=\"Membrane potential [mV]\", yformatter=y->y*1000)","category":"page"},{"location":"examples/#Enzyme-Catalysed-Reactions","page":"Examples","title":"Enzyme Catalysed Reactions","text":"","category":"section"},{"location":"examples/","page":"Examples","title":"Examples","text":"We can create custom reaction components which describe enzyme-catalyzed reaction mechanices, such as the Michaelis-Menten rate law.","category":"page"},{"location":"examples/","page":"Examples","title":"Examples","text":"warning: Warning\nThis method of adding custom components will be deprecated in the near future.","category":"page"},{"location":"examples/","page":"Examples","title":"Examples","text":"using BondGraphs\r\nusing Catalyst\r\nusing Plots","category":"page"},{"location":"examples/","page":"Examples","title":"Examples","text":"New components are constructed using the same dictionary structure as in the default component library. See addlibrary! for more details.","category":"page"},{"location":"examples/","page":"Examples","title":"Examples","text":"using ModelingToolkit\r\n\r\n@parameters t R T r1 r2 k_c e_T\r\n@variables E(t)[1:2] F(t)[1:2] # effort and flow variables\r\n\r\nR, T = GlobalScope(R), GlobalScope(T) # no namespace\r\nD = Differential(t)\r\n\r\n# Custom Michaelis-Mentin reaction component\r\nReMM = Dict(\r\n    :description => \"\"\"\r\n    Michaelis-Menten reaction\r\n    r1: Rate of reaction 1\r\n    r2: Rate of reaction 2\r\n    k_c: Affinity of complex relative to free enzyme\r\n    e_T: Total amount of enzyme\r\n    R: Universal Gas Constant\r\n    T: Temperature\r\n    \"\"\",\r\n    :numports => 2,\r\n    :variables => Dict(\r\n        :parameters => Dict(\r\n            r1 => 1,\r\n            r2 => 1,\r\n            k_c => 1,\r\n            e_T => 1\r\n        ),\r\n        :globals => Dict(\r\n            R => 8.314,\r\n            T => 310.0\r\n        )\r\n    ),\r\n    :equations => [\r\n        0 ~ F[1] + F[2],\r\n        0 ~ F[1] - e_T*r1*r2*k_c*(exp(E[1]/R/T) - exp(E[2]/R/T)) / (r1*exp(E[1]/R/T) + r2*exp(E[2]/R/T) + k_c*(r1+r2))\r\n    ]\r\n)\r\n\r\n# add to component library\r\naddlibrary!(Dict(:ReMM => ReMM))\r\n\r\nReMM[:equations]","category":"page"},{"location":"examples/","page":"Examples","title":"Examples","text":"We will create a bond graph with these new equations. $ A \\rightleftharpoons B \\rightleftharpoons C $","category":"page"},{"location":"examples/","page":"Examples","title":"Examples","text":"rn_enzyme = @reaction_network EnzymeNetwork begin\r\n    (1, 1), A <--> B\r\n    (1, 1), B <--> C\r\nend\r\nbg = BondGraph(rn_enzyme)\r\n\r\nbg.A.K, bg.B.K, bg.C.K = 1, 1, 1\r\n\r\n# Swap mass-action components for new michaelis-menten components\r\nMM1 = Component(:ReMM, \"MM1\"; r1=100, r2=100)\r\nMM2 = Component(:ReMM, \"MM2\"; r1=100, r2=100)\r\nswap!(bg, bg.R1, MM1)\r\nswap!(bg, bg.R2, MM2)\r\n\r\nplot(bg)","category":"page"},{"location":"examples/","page":"Examples","title":"Examples","text":"constitutive_relations(bg; sub_defaults=true)","category":"page"},{"location":"examples/","page":"Examples","title":"Examples","text":"sol = simulate(bg, (0., 20.); u0=[200,50,100])\r\nplot(sol, lw=2)","category":"page"},{"location":"background/#Background","page":"Background","title":"Background","text":"","category":"section"},{"location":"background/","page":"Background","title":"Background","text":"Bond graphs are an energy-based modelling framework that describe the rate of energy flow moving through system components. By construction, bond graph models enforce physical and thermodynamic constraints, guaranteeing compatibility with other physical models. This framework has been applied to mechanical, electrical, chemical, and biological systems, and is even capable of modelling complex multi-physics systems.","category":"page"},{"location":"#Introduction","page":"Introduction","title":"Introduction","text":"","category":"section"},{"location":"#Overview","page":"Introduction","title":"Overview","text":"","category":"section"},{"location":"","page":"Introduction","title":"Introduction","text":"BondGraphs.jl is a Julia implementation of the bond graph framework. Bond graphs are an energy-based modelling framework that describe energy flow through a physical system, and are especially useful for modelling multi-scale or multi-physical systems.[1]","category":"page"},{"location":"","page":"Introduction","title":"Introduction","text":"[1]: Gawthrop and Bevan, Bond-graph modeling (2007)","category":"page"},{"location":"","page":"Introduction","title":"Introduction","text":"This package constructs a symbolic graph model of a physical system, which can then be converted into a system of differential equations. BondGraphs.jl includes specific methods that interact with the wider Julia modelling ecosystem, including ModelingToolkit.jl, Catalyst.jl, and Plots.jl.","category":"page"},{"location":"","page":"Introduction","title":"Introduction","text":"Pages   = [\r\n    \"gettingstarted.md\",\r\n    \"examples.md\",\r\n    \"api.md\"\r\n]\r\nDepth = 1","category":"page"},{"location":"#Installation","page":"Introduction","title":"Installation","text":"","category":"section"},{"location":"","page":"Introduction","title":"Introduction","text":"using Pkg; Pkg.add(url=\"https://github.com/jedforrest/BondGraphs.jl\")\r\nusing BondGraphs","category":"page"},{"location":"#Tutorials","page":"Introduction","title":"Tutorials","text":"","category":"section"},{"location":"","page":"Introduction","title":"Introduction","text":"For tutorials and examples, refer to the Examples page. For interactive Jupyter Notebook tutorials, refer to BondGraphsTutorials on GitHub.","category":"page"}]
}
