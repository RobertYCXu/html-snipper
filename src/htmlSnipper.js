const convertNodesToTree = (nodes, index) => {
    if (nodes[index] && nodes[index].node.nodeName === '#text') {
        return { node: nodes[index].node, children: [] };
    }
    const obj = { node: nodes[index].node, children: [] };
    for (let i = index; i < nodes.length; i += 1) {
        if (nodes[i].parentNode === obj.node) obj.children.push(convertNodesToTree(nodes, i));
    }
    return obj;
};

const convertTreeToHTML = (nodeObj, continueOlNumbering, offset) => {
    if (nodeObj.node.nodeName === '#text') return nodeObj.node.nodeValueCut;

    const numbering = continueOlNumbering && nodeObj.node.nodeName === 'OL'
        ? ` start=${parseInt(nodeObj.node.attributes.start.nodeValue, 10) + offset}`
        : '';

    let baseString = `<${nodeObj.node.nodeName.toLowerCase()}${numbering}>`;

    for (let i = 0; i < nodeObj.children.length; i += 1) {
        baseString += convertTreeToHTML(nodeObj.children[i], continueOlNumbering, offset);
    }

    baseString += `</${nodeObj.node.nodeName.toLowerCase()}>`;
    return baseString;
};

const getHighlightText = (range, continueOlNumbering = true) => {
    const getNextNode = (node) => {
        let temp = node;
        if (temp.firstChild) return temp.firstChild;
        while (temp) {
            if (temp.nextSibling) return temp.nextSibling;
            temp = temp.parentNode;
        }
        return null;
    };

    const {
        startContainer: startNode,
        endContainer: endNode,
        commonAncestorContainer: commonAncestorNode,
        startOffset,
        endOffset,
    } = range;

    const nodes = [];

    let offset = 0;

    if (startNode === commonAncestorNode) {
        if (startNode.nodeValue) {
            startNode.nodeValueCut = startNode.nodeValue.substring(startOffset, endOffset);
        }
        if (startNode.parentNode.nodeName !== 'LI') {
            nodes.push({ node: startNode.parentNode, parentNode: startNode.parentNode.parentNode });
        }
        nodes.push({ node: startNode, parentNode: startNode.parentNode });
    } else {
        if (startNode.nodeValue) {
            startNode.nodeValueCut = startNode.nodeValue.substring(startOffset);
        }

        if (endNode.nodeValue) endNode.nodeValueCut = endNode.nodeValue.substring(0, endOffset);

        for (let tempNode = startNode.parentNode; tempNode; tempNode = tempNode.parentNode) {
            tempNode.nodeValueCut = tempNode.nodeValue;
            nodes.push({ node: tempNode, parentNode: tempNode.parentNode });
            if (tempNode === commonAncestorNode) break;
        }

        nodes.reverse();

        for (let tempNode = startNode; tempNode; tempNode = getNextNode(tempNode)) {
            if (tempNode) {
                if (tempNode !== startNode && tempNode !== endNode) {
                    tempNode.nodeValueCut = tempNode.nodeValue;
                }
                nodes.push({ node: tempNode, parentNode: tempNode.parentNode });
                if (tempNode === endNode) break;
            }
        }
    }
    if ((commonAncestorNode.nodeName === 'OL') || (nodes[1] && nodes[1].node.nodeName === 'OL')) {
        let tempNode = startNode;
        while (tempNode.nodeName !== 'LI') tempNode = tempNode.parentNode;
        while (tempNode.previousSibling && tempNode.previousSibling.nodeName === 'LI') {
            offset += 1;
            tempNode = tempNode.previousSibling;
        }
    }

    const nodeTree = convertNodesToTree(nodes, 0);
    const html = convertTreeToHTML(nodeTree, continueOlNumbering, offset);
    return { html, nodeTree };
};

module.exports = getHighlightText;

