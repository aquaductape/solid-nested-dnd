import { createStore } from "solid-js/store";
import Sortable from "sortablejs";

export type Item = {
  title: string;
};

export type FolderData = {
  type: "folder";
  data: Folder;
};
export type ItemData = {
  type: "item";
  data: Item;
};

type TNode = {
  [key: number]: { children: { id: number }[] } & (
    | ItemData
    | FolderData
    | { type: "root" }
  );
};

export type Folder = {
  title: string;
};

export type FolderNode = {
  [key: number]: {
    folder: Folder;
    itemIds: number[];
  };
};

type TStore = {
  currentNode: {
    itemId: number;
    folderId: number;
  } | null;
  dndTemp: {
    tempId: string | null;
    id: number | null;
    isDndShadowItem: boolean;
  };
  title: string;
  node: TNode;
  nextNodeId: number;
  sortableState: Sortable.SortableOptions;
};

const defaultState: TStore = {
  sortableState: { swapThreshold: 0.1 },
  title: "Main Directory",
  currentNode: {
    folderId: 0,
    itemId: 1,
  },
  nextNodeId: 51,
  dndTemp: { id: null, tempId: null, isDndShadowItem: true },
  node: {
    0: {
      type: "root",
      children: [{ id: 1 }, { id: 2 }],
    },
    1: {
      type: "folder",
      data: {
        title: "Folder",
      },
      children: [{ id: 3 }, { id: 4 }, { id: 8 }],
    },
    2: {
      type: "folder",
      data: {
        title: "Documents",
      },
      children: [{ id: 9 }, { id: 10 }],
    },
    20: {
      type: "folder",
      data: {
        title: "Ultra!!!",
      },
      children: [],
    },
    3: {
      type: "folder",
      data: {
        title: "Work",
      },
      children: [{ id: 5 }, { id: 6 }],
    },
    4: {
      type: "folder",
      data: {
        title: "Applications",
      },
      children: [{ id: 7 }, { id: 11 }, { id: 12 }],
    },
    5: {
      type: "item",
      data: {
        title: "Content",
      },
      children: [],
    },
    6: {
      type: "item",
      data: {
        title: "Padding",
      },
      children: [],
    },
    7: {
      type: "item",
      data: {
        title: "cat",
      },
      children: [],
    },
    8: {
      type: "item",
      data: {
        title: "bugs",
      },
      children: [],
    },
    9: {
      type: "item",
      data: {
        title: "boxy",
      },
      children: [],
    },
    10: {
      type: "item",
      data: {
        title: "Stacks",
      },
      children: [],
    },
    11: {
      type: "item",
      data: {
        title: "Bar",
      },
      children: [],
    },
    12: {
      type: "folder",
      data: {
        title: "Recent",
      },
      children: [{ id: 13 }],
    },
    13: {
      type: "item",
      data: {
        title: "super item",
      },
      children: [],
    },
  },
};
export const [store, setStore] = createStore<TStore>(defaultState);
