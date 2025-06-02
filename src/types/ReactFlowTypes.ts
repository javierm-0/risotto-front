import {Node,Edge} from 'reactflow';

export interface RFNode extends Node{
    nodeData: any,
    [key : string] : any
}
export type RFEdge = Edge;