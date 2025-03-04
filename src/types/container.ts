import { CustomElement } from "./editor";

export type ContainerLayout = 
  | 'two-rows'
  | 'three-rows'
  | 'four-rows'
  | 'one-left-two-right'
  | 'one-left-three-right'
  | 'two-columns'
  | 'three-columns'
  | 'four-columns';


export type ContainerElement = {
  type: 'container';
  layout: ContainerLayout;
  children: CustomElement[];
};