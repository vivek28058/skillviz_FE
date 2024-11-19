import { useCallback, useMemo } from "react";
import ReactFlow, {
  type Node,
  type Edge,
  type Connection,
  Controls,
  MarkerType,
  Position,
  addEdge,
  useEdgesState,
  useNodesState,
  Background,
} from "reactflow";
import "reactflow/dist/style.css";

// const initialNodes = [
//   {
//     id: "horizontal-1",
//     sourcePosition: Position.Right,
//     type: "input",
//     data: { label: "Intern" },
//     position: { x: 0, y: 150 },
//     draggable: false,
//   },
//   {
//     id: "horizontal-2",
//     sourcePosition: Position.Right,
//     targetPosition: Position.Left,
//     data: { label: "Trainee" },
//     position: { x: 250, y: 150 },
//     draggable: false,
//   },
//   {
//     id: "horizontal-3",
//     sourcePosition: Position.Right,
//     targetPosition: Position.Left,
//     data: { label: "Associate" },
//     position: { x: 500, y: 150 },
//     draggable: false,
//   },
//   {
//     id: "horizontal-4",
//     sourcePosition: Position.Right,
//     targetPosition: Position.Left,
//     data: { label: "Engineer" },
//     position: { x: 750, y: 150 },
//     draggable: false,
//   },
//   {
//     id: "horizontal-5",
//     sourcePosition: Position.Right,
//     targetPosition: Position.Left,
//     data: { label: "Senior Engineer" },
//     position: { x: 1000, y: 150 },
//     draggable: false,
//   },
//   {
//     id: "horizontal-6",
//     sourcePosition: Position.Right,
//     targetPosition: Position.Left,
//     data: { label: "Lead Engineer" },
//     position: { x: 1250, y: 150 },
//     draggable: false,
//   },
//   {
//     id: "m1",
//     type: "output",
//     data: { label: "People Management" },
//     position: { x: 1550, y: -50 },
//     style: { backgroundColor: "transparent", fontSize: 18, width: 650, height: 180 },
//     draggable: false,
//   },
//   {
//     id: "horizontal-7",
//     sourcePosition: Position.Right,
//     targetPosition: Position.Left,
//     data: { label: "Manager" },
//     position: { x: 50, y: 80 },
//     parentNode: "m1",
//     draggable: false,
//   },
//   {
//     id: "horizontal-9",
//     sourcePosition: Position.Right,
//     targetPosition: Position.Left,
//     data: { label: "Senior Manager" },
//     position: { x: 250, y: 80 },
//     parentNode: "m1",
//     draggable: false,
//   },
//   {
//     id: "horizontal-10",
//     sourcePosition: Position.Right,
//     targetPosition: Position.Left,
//     data: { label: "Vice President" },
//     position: { x: 250, y: 80 },
//     parentNode: "m2",
//     draggable: false,
//   },
//   {
//     id: "m2",
//     type: "output",
//     data: { label: "Technical Management" },
//     position: { x: 1550, y: 150 },
//     style: { backgroundColor: "transparent", fontSize: 18, width: 650, height: 180 },
//     draggable: false,
//   },
//   {
//     id: "horizontal-8",
//     sourcePosition: Position.Right,
//     targetPosition: Position.Left,
//     data: { label: "Principal" },
//     position: { x: 50, y: 80 },
//     parentNode: "m2",
//     draggable: false,
//   },
//   {
//     id: "horizontal-11",
//     type: "output",
//     sourcePosition: Position.Right,
//     targetPosition: Position.Left,
//     data: { label: "Portfolio Manager" },
//     position: { x: 450, y: 80 },
//     parentNode: "m1",
//     draggable: false,
//   },
//   {
//     id: "horizontal-12",
//     type: "output",
//     sourcePosition: Position.Right,
//     targetPosition: Position.Left,
//     data: { label: "Senior Vice President" },
//     style: { width: "fit-content" },
//     position: { x: 450, y: 80 },
//     parentNode: "m2",
//     draggable: false,
//   },
// ];

// const initialEdges = [
//   {
//     id: "e1",
//     source: "horizontal-1",
//     type: "smoothstep",
//     target: "horizontal-2",
//     animated: true,
//     style: {
//       strokeWidth: 3,
//     },
//     markerEnd: {
//       type: MarkerType.ArrowClosed,
//     },
//   },
//   {
//     id: "e2",
//     source: "horizontal-2",
//     type: "smoothstep",
//     target: "horizontal-3",
//     animated: true,
//     style: {
//       strokeWidth: 3,
//     },
//     markerEnd: {
//       type: MarkerType.ArrowClosed,
//     },
//   },
//   {
//     id: "e3",
//     source: "horizontal-3",
//     type: "smoothstep",
//     target: "horizontal-4",
//     // label: "edge label",
//     animated: true,
//     style: {
//       strokeWidth: 3,
//     },
//     markerEnd: {
//       type: MarkerType.ArrowClosed,
//     },
//   },
//   {
//     id: "e4",
//     source: "horizontal-4",
//     type: "smoothstep",
//     target: "horizontal-5",
//     animated: true,
//     style: {
//       strokeWidth: 3,
//     },
//     markerEnd: {
//       type: MarkerType.ArrowClosed,
//     },
//   },
//   {
//     id: "e5",
//     source: "horizontal-5",
//     type: "smoothstep",
//     target: "horizontal-6",
//     animated: true,
//     style: {
//       strokeWidth: 3,
//     },
//     markerEnd: {
//       type: MarkerType.ArrowClosed,
//     },
//   },
//   {
//     id: "e6",
//     source: "horizontal-6",
//     target: "horizontal-7",
//     animated: true,
//     style: {
//       strokeWidth: 3,
//     },
//     markerEnd: {
//       type: MarkerType.ArrowClosed,
//     },
//   },
//   {
//     id: "e7",
//     source: "horizontal-6",
//     target: "horizontal-11",
//     animated: true,
//     style: {
//       strokeWidth: 3,
//     },
//     markerEnd: {
//       type: MarkerType.ArrowClosed,
//     },
//   },
//   {
//     id: "e8",
//     source: "horizontal-7",
//     target: "horizontal-8",
//     animated: true,
//     style: {
//       strokeWidth: 3,
//     },
//     markerEnd: {
//       type: MarkerType.ArrowClosed,
//     },
//   },
//   {
//     id: "e9",
//     source: "horizontal-8",
//     target: "horizontal-9",
//     animated: true,
//     style: {
//       strokeWidth: 3,
//     },
//     markerEnd: {
//       type: MarkerType.ArrowClosed,
//     },
//   },
//   {
//     id: "e10",
//     source: "horizontal-11",
//     target: "horizontal-12",
//     animated: true,
//     style: {
//       strokeWidth: 3,
//     },
//     markerEnd: {
//       type: MarkerType.ArrowClosed,
//     },
//   },
//   {
//     id: "e11",
//     source: "horizontal-12",
//     target: "horizontal-13",
//     animated: true,
//     style: {
//       strokeWidth: 3,
//     },
//     markerEnd: {
//       type: MarkerType.ArrowClosed,
//     },
//   },
// ];

interface NodeData {
  label: string;
}

function CategoryNode({ data }: { data: { label: string } }) {
  return <div className="flex justify-center">{data.label}</div>;
}

function generateNodeData(
  inputData: Array<Record<string, string>>,
  count?: any,
  dId?: string,
): Array<Node<NodeData, string | undefined>> {
  const nodes: Array<Node<NodeData, string | undefined>> = [];

  // Generate nodes for each item in the input data
  inputData?.forEach((item, index) => {
    const id = item.id || `horizontal-${index + 1}`;
    const keys = Object.keys(item);

    if (Object.hasOwn(item, "name")) {
      keys?.forEach((key, idx) => {
        const transformedCount = count?.find((hierarchy: any) => hierarchy[item[key]]);

        if (key == "name") return;

        if (key == "id") {
          // Container nodes
          nodes.push({
            id,
            type: "category",
            data: { label: item.name },
            position: {
              x: Object.keys(inputData[0]).length * 250 + 50,
              y: index === 1 ? -200 : index === 2 ? 100 : 100,
            },
            style: {
              backgroundColor: "transparent",
              fontSize: 18,
              width: (keys.length - 2) * 200 + 50,
              height: 180,
              border: "none",
            },
            draggable: false,
            connectable: false,
            focusable: false,
            selectable: false,
          });
          return;
        } else {
          const x = idx * 250 + 50;
          const y = 80;

          if (key == dId) {
            nodes.push({
              id: `horizontal-${nodes.length + 1}`,
              sourcePosition: Position.Right,
              targetPosition: Position.Left,
              data: {
                label: `${item[key]} ${count ? `(${transformedCount ? transformedCount[item[key]] : null})` : ""}`,
              },
              position: { x, y },
              parentNode: item.id,
              style: {
                display: "grid",
                placeItems: "center",
                minWidth: "150px",
                width: "fit-content",
                minHeight: "45px",
                border: "2px solid #0BDA51",
                borderRadius: "16px",
              },
              draggable: false,
            });
            return;
          }

          nodes.push({
            id: `horizontal-${nodes.length + 1}`,
            sourcePosition: Position.Right,
            targetPosition: Position.Left,
            data: {
              label: `${item[key]} ${count ? `(${transformedCount ? transformedCount[item[key]] : 0})` : ""}`,
            },
            position: { x, y },
            parentNode: item.id,
            style: {
              display: "grid",
              placeItems: "center",
              minWidth: "150px",
              width: "fit-content",
              minHeight: "45px",
              borderRadius: "16px",
            },
            draggable: false,
          });
        }
        return;
      });
    } else {
      // Input nodes
      keys?.forEach((key, idx) => {
        const x = idx * 250;
        const y = 0;
        const targetPosition = index === 0 && idx === 0 ? Position.Right : Position.Left;

        const transformedCount = count?.find((hierarchy: any) => hierarchy[item[key]]);

        if (key == dId) {
          nodes.push({
            id: `horizontal-${index + 1 + idx}`,
            sourcePosition: Position.Right,
            targetPosition,
            data: {
              label: `${item[key]} ${count ? `(${transformedCount ? transformedCount[item[key]] : null})` : ""}`,
            },
            position: { x, y },
            style: {
              display: "grid",
              placeItems: "center",
              minWidth: "150px",
              width: "fit-content",
              minHeight: "45px",
              border: "3px solid #0BDA51",
              borderRadius: "16px",
            },
            draggable: false,
          });
          return;
        }

        nodes.push({
          id: `horizontal-${index + 1 + idx}`,
          sourcePosition: Position.Right,
          targetPosition,
          data: { label: `${item[key]} ${count ? `(${transformedCount ? transformedCount[item[key]] : 0})` : ""}` },
          position: { x, y },
          style: {
            display: "grid",
            placeItems: "center",
            minWidth: "150px",
            width: "fit-content",
            minHeight: "45px",
            borderRadius: "16px",
          },
          draggable: false,
        });
      });
      return;
    }
  });

  return nodes;
}

function generateEdgeData(nodeData: Array<Node>, intervals: Array<{ start: number; end: number }>): Array<Edge> {
  const edges: Array<Edge> = [];

  // Generate edges connecting nodes
  intervals.forEach((interval) => {
    for (let i = interval.start; i <= interval.end; i++) {
      const edgeId = `e${i}`;
      if (Object.hasOwn(nodeData[i], "type")) return;

      edges.push({
        id: edgeId,
        source: `horizontal-${i}`,
        type: "smoothstep",
        target: `horizontal-${i + 1}`,
        animated: true,
        style: {
          strokeWidth: 5,
        },
        markerEnd: {
          type: MarkerType.ArrowClosed,
        },
      });
    }
  });

  intervals.forEach((interval, idx) => {
    const edgeId = `e${idx * 44}`;

    if (idx) {
      edges.push({
        id: edgeId,
        source: `horizontal-${intervals[0].end + 1}`,
        type: "smoothstep",
        target: `horizontal-${interval.start}`,
        animated: true,
        style: {
          strokeWidth: 5,
        },
        markerEnd: {
          type: MarkerType.ArrowClosed,
        },
      });
    }
  });

  return edges;
}

const nodeTypes = { category: CategoryNode };

const HorizontalFlow = (props: any) => {
  const hierarchy = useMemo(
    () =>
      props.hierarchy?.["Hierarchy_Progression"]?.flatMap((level: any) => {
        if (level?.Progression instanceof Object) return level?.Progression;
        return level?.Progression?.flatMap((lvl: any) => Object.values(lvl));
      }),
    [props.hierarchy],
  );

  // Generate node data
  const generatedNodes = generateNodeData(hierarchy, props?.count, props?.dId);
  console.debug("Node data:", generatedNodes);

  const intervals: Array<{ start: number; end: number }> = [];

  hierarchy?.forEach((level: Record<string, string>, i: number) => {
    const start = 1;
    const length = Object.keys(level).length;
    const end = i ? length - 2 : length;
    if (i) {
      intervals.push({ start: intervals[i - 1].end + 2 + (i - 1), end: intervals[i - 1].end + end + (i - 1) });
      return;
    }
    intervals.push({ start, end: length - 1 });
  });

  // Generate edge data
  const generatedEdges = generateEdgeData(generatedNodes, intervals);
  console.debug("Edge data:", generatedEdges);

  const [nodes, _, onNodesChange] = useNodesState(generatedNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(generatedEdges);
  const onConnect = useCallback((params: Connection) => setEdges((edge) => addEdge(params, edge)), []);

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      fitView
      nodeTypes={nodeTypes}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
      proOptions={{ hideAttribution: true }}
      minZoom={0.4}
    >
      <Controls showInteractive={false} />
      <Background size={2} />
    </ReactFlow>
  );
};

export default HorizontalFlow;
