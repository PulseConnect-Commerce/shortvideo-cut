// webpack (Remotion-Bundler): require.context meldet alle Projekte automatisch an
declare const require: {
  context(dir: string, sub: boolean, re: RegExp): { keys(): string[]; (id: string): unknown };
};
