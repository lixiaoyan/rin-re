import React from "react";
import PropTypes from "prop-types";
import sortBy from "lodash/sortBy";
import groupBy from "lodash/groupBy";

import File from "react-icons/lib/md/insert-drive-file";
import Folder from "react-icons/lib/md/folder";

import "./FileTree.css";

const getChildren = content => {
  return sortBy(
    Object.entries(groupBy(content, ({ path }) => path.split("/")[0])).map(
      ([prefix, children]) => {
        if (children.length === 1 && children[0].path === prefix) {
          return {
            type: "file",
            name: prefix,
          };
        } else {
          return {
            type: "directory",
            name: prefix,
            children: children.map(({ path, size }) => ({
              path: path.slice(prefix.length + 1),
              size,
            })),
          };
        }
      },
    ),
    ["type", "name"],
  );
};

const Tree = ({ content }) => (
  <ul className="FileTree-tree">
    {getChildren(content).map(
      child =>
        child.type === "file" ? (
          <li key={child.name} className="FileTree-treeItem">
            <div className="FileTree-item" title={child.name}>
              <File className="FileTree-itemIcon" />
              <span className="FileTree-itemName">{child.name}</span>
            </div>
          </li>
        ) : (
          <li key={child.name} className="FileTree-treeItem">
            <div className="FileTree-item" title={child.name}>
              <Folder className="FileTree-itemIcon" />
              <span className="FileTree-itemName">{child.name}</span>
            </div>
            <Tree content={child.children} />
          </li>
        ),
    )}
  </ul>
);

class FileTree extends React.PureComponent {
  static propTypes = {
    content: PropTypes.array.isRequired,
  };

  render() {
    return (
      <Tree
        content={this.props.content.map(([path, size]) => ({ path, size }))}
      />
    );
  }
}

export default FileTree;
