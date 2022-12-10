import { produce } from "solid-js/store";
import { setStore } from "../store/store";

const deleteNode = ({
  itemId,
  parentId,
}: {
  itemId: number;
  parentId: number;
}) =>
  setStore(
    produce((s) => {
      s.node[parentId].children = s.node[parentId].children.filter(
        (item) => item.id !== itemId
      );

      const nodes = [itemId];

      const getNodes = (id: number) => {
        s.node[id].children.forEach((item) => {
          nodes.push(item.id);
          getNodes(item.id);
        });
      };

      getNodes(itemId);

      nodes.forEach((nodeId) => {
        delete s.node[nodeId];
      });
    })
  );

export default deleteNode;
