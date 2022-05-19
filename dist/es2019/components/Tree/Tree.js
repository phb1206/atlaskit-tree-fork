import _extends from "@babel/runtime/helpers/extends";
import _defineProperty from "@babel/runtime/helpers/defineProperty";
import React, { Component } from 'react';
import { Draggable, Droppable, DragDropContext } from 'react-beautiful-dnd-next';
import { getBox } from 'css-box-model';
import { calculateFinalDropPositions } from './Tree-utils';
import { noop } from '../../utils/handy';
import { flattenTree, mutateTree } from '../../utils/tree';
import TreeItem from '../TreeItem';
import { getDestinationPath, getItemById, getIndexById } from '../../utils/flat-tree';
import DelayedFunction from '../../utils/delayed-function';
export default class Tree extends Component {
  constructor(...args) {
    super(...args);

    _defineProperty(this, "state", {
      flattenedTree: [],
      draggedItemId: undefined
    });

    _defineProperty(this, "itemsElement", {});

    _defineProperty(this, "expandTimer", new DelayedFunction(500));

    _defineProperty(this, "onDragStart", result => {
      const {
        onDragStart
      } = this.props;
      this.dragState = {
        source: result.source,
        destination: result.source,
        mode: result.mode
      };
      this.setState({
        draggedItemId: result.draggableId
      });

      if (onDragStart) {
        onDragStart(result.draggableId);
      }
    });

    _defineProperty(this, "onDragUpdate", update => {
      const {
        onDragUpdate
      } = this.props;
      const {
        onExpand
      } = this.props;
      const {
        flattenedTree
      } = this.state;

      if (!this.dragState) {
        return;
      }

      this.expandTimer.stop();

      if (update.combine) {
        const {
          draggableId
        } = update.combine;

        if (onDragUpdate) {
          onDragUpdate(draggableId);
        }

        const item = getItemById(flattenedTree, draggableId);

        if (item && this.isExpandable(item)) {
          this.expandTimer.start(() => onExpand(draggableId, item.path));
        }
      } else if (onDragUpdate) {
        onDragUpdate(null);
      }

      this.dragState = { ...this.dragState,
        destination: update.destination,
        combine: update.combine
      };
    });

    _defineProperty(this, "onDropAnimating", () => {
      this.expandTimer.stop();
    });

    _defineProperty(this, "onDragEnd", result => {
      const {
        onDragEnd,
        tree
      } = this.props;
      const {
        flattenedTree
      } = this.state;
      this.expandTimer.stop();
      const finalDragState = { ...this.dragState,
        source: result.source,
        destination: result.destination,
        combine: result.combine
      };
      this.setState({
        draggedItemId: undefined
      });
      const {
        sourcePosition,
        destinationPosition
      } = calculateFinalDropPositions(tree, flattenedTree, finalDragState);
      onDragEnd(sourcePosition, destinationPosition);
      this.dragState = undefined;
    });

    _defineProperty(this, "onPointerMove", () => {
      if (this.dragState) {
        this.dragState = { ...this.dragState,
          horizontalLevel: this.getDroppedLevel()
        };
      }
    });

    _defineProperty(this, "calculateEffectivePath", (flatItem, snapshot) => {
      const {
        flattenedTree,
        draggedItemId
      } = this.state;

      if (this.dragState && draggedItemId === flatItem.item.id && (this.dragState.destination || this.dragState.combine)) {
        const {
          source,
          destination,
          combine,
          horizontalLevel,
          mode
        } = this.dragState; // We only update the path when it's dragged by keyboard or drop is animated

        if (mode === 'SNAP' || snapshot.isDropAnimating) {
          if (destination) {
            // Between two items
            return getDestinationPath(flattenedTree, source.index, destination.index, horizontalLevel);
          }

          if (combine) {
            // Hover on other item while dragging
            return getDestinationPath(flattenedTree, source.index, getIndexById(flattenedTree, combine.draggableId), horizontalLevel);
          }
        }
      }

      return flatItem.path;
    });

    _defineProperty(this, "isExpandable", item => !!item.item.hasChildren && !item.item.isExpanded);

    _defineProperty(this, "getDroppedLevel", () => {
      const {
        offsetPerLevel
      } = this.props;
      const {
        draggedItemId
      } = this.state;

      if (!this.dragState || !this.containerElement) {
        return undefined;
      }

      const containerLeft = getBox(this.containerElement).contentBox.left;
      const itemElement = this.itemsElement[draggedItemId];

      if (itemElement) {
        const currentLeft = getBox(itemElement).contentBox.left;
        const relativeLeft = Math.max(currentLeft - containerLeft, 0);
        return Math.floor((relativeLeft + offsetPerLevel / 2) / offsetPerLevel) + 1;
      }

      return undefined;
    });

    _defineProperty(this, "patchDroppableProvided", provided => {
      return { ...provided,
        innerRef: el => {
          this.containerElement = el;
          provided.innerRef(el);
        }
      };
    });

    _defineProperty(this, "setItemRef", (itemId, el) => {
      if (!!el) {
        this.itemsElement[itemId] = el;
      }
    });

    _defineProperty(this, "renderItems", () => {
      const {
        flattenedTree
      } = this.state;
      return flattenedTree.map(this.renderItem);
    });

    _defineProperty(this, "renderItem", (flatItem, index) => {
      const {
        isDragEnabled
      } = this.props; // If drag and drop is explicitly disabled for all items, render TreeItem directly with stubbed provided and snapshot

      if (isDragEnabled === false) {
        return this.renderTreeItem({
          flatItem,
          path: flatItem.path,
          provided: {
            draggableProps: {
              'data-react-beautiful-dnd-draggable': ''
            },
            innerRef: () => {},
            dragHandleProps: null
          },
          snapshot: {
            isDragging: false,
            isDropAnimating: false
          }
        });
      }

      const isDragDisabled = typeof isDragEnabled === 'function' ? !isDragEnabled(flatItem.item) : !isDragEnabled;
      return /*#__PURE__*/React.createElement(Draggable, {
        key: flatItem.item.id,
        draggableId: flatItem.item.id.toString(),
        index: index,
        isDragDisabled: isDragDisabled
      }, this.renderDraggableItem(flatItem));
    });

    _defineProperty(this, "renderDraggableItem", flatItem => (provided, snapshot) => {
      const currentPath = this.calculateEffectivePath(flatItem, snapshot);

      if (snapshot.isDropAnimating) {
        this.onDropAnimating();
      }

      return this.renderTreeItem({
        flatItem,
        path: currentPath,
        provided,
        snapshot
      });
    });

    _defineProperty(this, "renderTreeItem", ({
      flatItem,
      path,
      provided,
      snapshot
    }) => {
      const {
        renderItem,
        onExpand,
        onCollapse,
        offsetPerLevel
      } = this.props;
      return /*#__PURE__*/React.createElement(TreeItem, {
        key: flatItem.item.id,
        item: flatItem.item,
        path: path,
        onExpand: onExpand,
        onCollapse: onCollapse,
        renderItem: renderItem,
        provided: provided,
        snapshot: snapshot,
        itemRef: this.setItemRef,
        offsetPerLevel: offsetPerLevel
      });
    });
  }

  static getDerivedStateFromProps(props, state) {
    const {
      draggedItemId
    } = state;
    const {
      tree
    } = props;
    const finalTree = Tree.closeParentIfNeeded(tree, draggedItemId);
    const flattenedTree = flattenTree(finalTree);
    return { ...state,
      flattenedTree
    };
  }

  static closeParentIfNeeded(tree, draggedItemId) {
    if (!!draggedItemId) {
      // Closing parent internally during dragging, because visually we can only move one item not a subtree
      return mutateTree(tree, draggedItemId, {
        isExpanded: false
      });
    }

    return tree;
  }

  render() {
    const {
      isNestingEnabled
    } = this.props;
    const renderedItems = this.renderItems();
    return /*#__PURE__*/React.createElement(DragDropContext, {
      onDragStart: this.onDragStart,
      onDragEnd: this.onDragEnd,
      onDragUpdate: this.onDragUpdate
    }, /*#__PURE__*/React.createElement(Droppable, {
      droppableId: "tree",
      isCombineEnabled: isNestingEnabled,
      ignoreContainerClipping: true
    }, provided => {
      const finalProvided = this.patchDroppableProvided(provided);
      return /*#__PURE__*/React.createElement("div", _extends({
        ref: finalProvided.innerRef,
        style: {
          pointerEvents: 'auto'
        },
        onTouchMove: this.onPointerMove,
        onMouseMove: this.onPointerMove
      }, finalProvided.droppableProps), renderedItems, provided.placeholder);
    }));
  }

}

_defineProperty(Tree, "defaultProps", {
  tree: {
    children: []
  },
  onExpand: noop,
  onCollapse: noop,
  onDragStart: noop,
  onDragEnd: noop,
  renderItem: noop,
  offsetPerLevel: 35,
  isDragEnabled: false,
  isNestingEnabled: false
});