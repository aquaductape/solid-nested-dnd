import Dismiss from "solid-dismiss";
import {
  Component,
  createEffect,
  createMemo,
  createSignal,
  For,
  Index,
  Match,
  onCleanup,
  onMount,
  Show,
  Switch,
  untrack,
} from "solid-js";
import { produce } from "solid-js/store";
import { Folder, Item, setStore, store } from "../store/store";
import { Modal } from "./Modal";
import Sortable from "sortablejs";
import JSON_Stringify_Parse from "../utils/jsonStringifyParse";
import deleteNode from "../utils/deleteNode";

const SortableWrapper: Component<{
  onStart?: (event: Sortable.SortableEvent) => void;
  onEnd?: (event: Sortable.SortableEvent) => void;
}> = (props) => {
  const { onEnd, onStart } = props;
  let sortable: Sortable;
  let el!: HTMLDivElement;

  onMount(() => {
    sortable = new Sortable(el, {
      group: {
        name: "nested",
      },

      animation: 150,
      swapThreshold: 0.2,
      ghostClass: "opacity-0",
      dragClass: "opacity-100",
      fallbackOnBody: true,
      scroll: true,
      forceFallback: true,
      onStart: (e) => onStart!(e),
      onEnd,
    });
  });

  createEffect(() => {
    sortable.option("swapThreshold", store.sortableState.swapThreshold);
  });

  onCleanup(() => {
    console.log("dismount!!");
    sortable.destroy();
  });

  return <div ref={el}>{props.children}</div>;
};

const Tree = () => {
  let button!: HTMLButtonElement;
  const [toggle, setToggle] = createSignal(false);

  return (
    <div class="nested" data-sortable-id="0">
      <SortableWrapper
        onStart={onStartSortableHandler}
        onEnd={onEndSortableHandler({ id: 0 })}
      >
        <For each={store.node[0].children}>
          {(id) => {
            return <Node id={id.id} parentId={0} />;
          }}
        </For>
      </SortableWrapper>
      <div class="">
        <button class="flex px-5 py-2" ref={button}>
          <span>
            Add <strong>Folder</strong>
          </span>{" "}
        </button>
        <Dismiss
          open={toggle}
          setOpen={setToggle}
          focusElementOnOpen={"[data-modal-focus-on-open]"}
          menuButton={button}
          modal
        >
          <div class="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black/25 z-50">
            <Modal
              type="folder"
              parentId={0}
              onCloseModal={() => setToggle(false)}
            />
          </div>
        </Dismiss>
      </div>
    </div>
  );
};

const onEndSortableHandler = ({ id }: { id: number }) => {
  const run = (e: Sortable.SortableEvent) => {
    const element = e.item;
    const parentElement = element.parentElement!.closest(".nested");
    const currentId = Number(element.getAttribute("data-sortable-id")!);
    const newParentId = Number(
      parentElement?.getAttribute("data-sortable-id")!
    );
    const newIndex = e.newIndex!;
    let removedLastItemFromFolder = false;
    element.remove();
    setStore(
      produce((s) => {
        const parentNode = s.node[id];
        const newParentNode =
          newParentId === id ? parentNode : s.node[newParentId];
        const foundIdx = parentNode.children.findIndex(
          (id) => id.id === currentId
        )!;

        parentNode.children.splice(foundIdx, 1);
        newParentNode.children.splice(newIndex, 0, { id: currentId });
        console.log("onEnd", JSON_Stringify_Parse(parentNode));
        console.log("onEnd", JSON_Stringify_Parse(newParentNode));
      })
    );
  };
  return run;
};

const onStartSortableHandler = (e: Sortable.SortableEvent) => {
  const isItem = e.item.getAttribute("data-item") != null;
  setStore("sortableState", "swapThreshold", isItem ? 0.9 : 0.2);
};

const Node: Component<{ id: number; parentId: number }> = (props) => {
  const data = createMemo(() => {
    return (store.node[props.id] as any)?.data as Folder | Item;
  });
  const node = createMemo(() => {
    return store.node[props.id];
  });

  return (
    <Show when={node()}>
      <Switch>
        <Match when={node().type === "folder"}>
          <Group
            id={props.id}
            parentId={props.parentId}
            // @ts-ignore
            title={node().data.title}
          >
            <SortableWrapper
              onStart={onStartSortableHandler}
              onEnd={onEndSortableHandler({ id: props.id })}
            >
              <For each={node().children}>
                {(child) => {
                  return <Node id={child.id} parentId={props.id} />;
                }}
              </For>
            </SortableWrapper>
          </Group>
        </Match>
        <Match when={node().type === "item"}>
          <TreeItem
            id={props.id}
            parentId={props.parentId}
            item={data() as Item}
          />
        </Match>
      </Switch>
    </Show>
  );
};

const Group: Component<Folder & { id: number; parentId: number }> = (props) => {
  let button!: HTMLButtonElement;
  const [toggle, setToggle] = createSignal(false);

  const onClick = () => {
    const { parentId, id: itemId } = props;
    deleteNode({ itemId, parentId });
  };
  return (
    <div
      data-sortable-id={props.id}
      class="bg-white shadow-md shadow-gray-100 border-4 border-black/50 p-5 my-5 nested"
    >
      <div class="flex justify-between pb-5 border-b border-gray-100">
        <h2 class="font-bold text-black/50">{props.title}</h2>
        <button onClick={onClick} class="p-1">
          Delete
        </button>
      </div>
      <div class="">{props.children}</div>
      <div class="mt-5">
        <button class="flex px-5 py-2" ref={button}>
          <span>Add</span>
        </button>
        <Dismiss
          open={toggle}
          setOpen={setToggle}
          focusElementOnOpen={"[data-modal-focus-on-open]"}
          menuButton={button}
          modal
        >
          <div class="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black/25 z-50">
            <Modal
              type="item"
              parentId={props.id}
              onCloseModal={() => setToggle(false)}
            />
          </div>
        </Dismiss>
      </div>
    </div>
  );
};

const TreeItem: Component<{ id: number; parentId: number; item: Item }> = (
  props
) => {
  const onClick = () => {
    const { parentId, id: itemId } = props;
    deleteNode({ itemId, parentId });
  };
  onCleanup(() => {
    console.log("ViewItem REMOVED!");
  });
  return (
    <div
      data-sortable-id={props.id}
      data-item
      class="flex items-center py-5 border-b border-gray-100 bg-white"
    >
      <div class="mr-2">{props.id}</div>
      <div>{props.item.title}</div>
      <div class="ml-auto flex gap-2">
        <button onClick={onClick} class="p-1">
          Delete
        </button>
      </div>
    </div>
  );
};
export default Tree;
