export type FigmaFile = {
  name: string,
  lastModified: string,
  thumbnailUrl: string,
  version: string,
  document: {
    id: string,
    name: string,
    type: 'DOCUMENT',
    children: CanvasObject[],
  },
  components: any // TODO
  schemaVersions: number,
  styles: any, // TODO
}

// Children Types

export type ChildProps = {
  id: string,
  name: string,
  backgroundColor: Color,
  absoluteBoundingBox: {
    x: number,
    y: number,
    width: number,
    height: number,
  },
  constraints: {
    vertical: string,
    horizontal: string,
  },
  prototypeStartNodeID: null | string,
}

// In Figma's user interface the top level element for a file is a "page" in the code is called a canvas.
export type CanvasObject = ChildProps & {
  type: 'CANVAS',
  clipsContent: boolean,
  background: Background[]
  children: Elements[],
  prototypeStartNodeID: null | string,
}

export type Elements = TextObject | FrameObject | GroupObject

type ElementProps = ChildProps & {
  blendMode: BlendMode,
}

export type FrameObject = ElementProps & {
  type: 'FRAME'
  children: Elements[],
} 

export type GroupObject = ElementProps & {
  type: 'GROUP'
  children: Elements[],
  clipsContent: boolean,
} 

export type TextObject = ElementProps & {
  type: 'TEXT',
  strokes: Stroke[],
  strokeWeight: number,
  strokeAlign: string,
  effects: Effect[],
  characters: string,
  style: TextStyles,
  characterStyleOverrides: CharacterStyleOverrides
  styleOverrideTable: StyleOverrideTable
}


// Property types

type Background = {
  type: FillType,
  blendMode: BlendMode
  color: Color,
  backgroundColor: Color,
  effects: Effect[]
}

type Color = {
  r: number,
  g: number,
  b: number,
  a: number,
}

type BlendMode = string // TODO
type FillType = string // TODO
type Effect = any // TODO
type Stroke = any // TODO
type TextStyles = any // TODO
type CharacterStyleOverrides = any  // TODO
type StyleOverrideTable = any  // TODO
