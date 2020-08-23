export class LayoutModel {
  constructor(
    public vertical: string,
    public horizontal: string
  ) {}
}

export function validLayout(value: unknown): boolean {
  const layout = value as string;
  return layout === 'top-left' ||
         layout === 'top-right' ||
         layout === 'bottom-right' ||
         layout === 'bottom-left';

}

export function validKind(value: unknown): boolean {
  const kind = value as string;
  return kind === 'blade' ||
         kind === 'handle' ||
         kind === 'handle-no-trans';
}

export function parseLayout(layout: string): LayoutModel {
  const parts = layout.split('-');

  return new LayoutModel(
    parts[0],
    parts[1]
  );
}