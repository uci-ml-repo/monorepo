import { build } from 'esbuild'
import { resolve } from 'path'
import { copySync } from 'fs-extra'

const schema_name = 'schema.prisma'
const prisma_schema = '../../prisma/' + schema_name
const engine_name = 'libquery_engine-debian-openssl-1.1.x.so.node'
const prisma_engine = '../../node_modules/@prisma/engines/' + engine_name

copySync(resolve(__dirname, prisma_schema), resolve(__dirname, '../dist/' + schema_name))

copySync(resolve(__dirname, prisma_engine), resolve(__dirname, '../dist/' + engine_name))

build({
  entryPoints: [resolve(__dirname, '../src/index.ts')],
  platform: 'node',
  bundle: true,
  minify: true,
  outfile: resolve(__dirname, '../dist/bundle.js'),
})
