export interface Student {
  id: number;
  name: string;
  score: number;
  group: string;
}

export type ViewMode = 'LIST' | 'TUPLE' | 'DICT' | 'SERIES' | 'DATAFRAME';

export interface IndentLine {
  id: number;
  code: string;
  indent: number; // 0, 1, 2
  type: 'control' | 'action' | 'comment';
  explanation: string;
}

export interface VariableLabel {
  id: string;
  name: string; // e.g., 'x', 'data', 'df'
  expectedType: 'number' | 'list' | 'dataframe';
}

export interface DataBlock {
  id: string;
  type: 'number' | 'list' | 'dataframe';
  value: string; // Display representation
  assignedLabelId: string | null;
}

export interface BracketToken {
  id: string;
  char: string;
  content?: string;
  depth: number;
  partnerId: string | null;
  type: 'bracket' | 'content';
}

export type ChainStep = 0 | 1 | 2 | 3;
