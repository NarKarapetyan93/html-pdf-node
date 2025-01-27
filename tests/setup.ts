import { register } from 'ts-node';

register({
  transpileOnly: true,
  compilerOptions: {
    module: 'commonjs',
    target: 'es2018',
    esModuleInterop: true
  }
});