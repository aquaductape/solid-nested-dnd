import { Component, createSignal, Show } from "solid-js";
import { produce } from "solid-js/store";
import { Item, setStore } from "../store/store";

export const Modal: Component<{
  type: "folder" | "item";
  parentId: number;
  id?: string;
  item?: Item;
  onCloseModal: () => void;
}> = ({ type: _type, parentId, id, item, onCloseModal }) => {
  const [title, setTitle] = createSignal("");
  const [isItem, setIsItem] = createSignal(_type === "item");

  const onSubmit = async () => {
    if (!title()) return;

    setStore(
      produce((s) => {
        const newId = s.nextNodeId + 1;
        s.nextNodeId = newId;
        if (isItem()) {
          s.node[newId] = {
            type: "item",
            data: {
              title: title(),
            },
            children: [],
          };
          s.node[parentId].children.push({ id: newId });
          return;
        }

        if (!isItem()) {
          s.node[newId] = {
            type: "folder",
            data: {
              title: title(),
            },
            children: [],
          };
          s.node[parentId].children.push({ id: newId });
          return;
        }
      })
    );
    onCloseModal();
  };

  return (
    <div class="w-[80vw] p-6 bg-white rounded-xl shadow-md">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit();
        }}
      >
        <div>
          <input
            data-modal-focus-on-open
            class="border-2 border-gray-50 rounded-lg"
            placeholder="Title ..."
            type="text"
            value={title()}
            onInput={(e) => setTitle(e.currentTarget.value)}
          />
          <div class="flex gap-2">
            <button
              class="p-2 border border-gray-200 rounded-md"
              classList={{ "bg-grey-200": isItem() }}
              onClick={() => setIsItem(true)}
            >
              Item
            </button>
            <button
              class="p-2 border border-gray-200 rounded-md"
              classList={{ "bg-grey-200": !isItem() }}
              onClick={() => setIsItem(false)}
            >
              Folder
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
