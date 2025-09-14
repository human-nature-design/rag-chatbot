import { nanoid } from '@/lib/utils';
import { index, pgTable, text, varchar, vector } from 'drizzle-orm/pg-core';
import { resources } from './resources';

// Table for embeddings to store the embeddings (chunks and vectors) for the resources
export const embeddings = pgTable(
  'embeddings',
  {
    // Unique identifier for the embedding
    id: varchar('id', { length: 191 })
      .primaryKey()
      .$defaultFn(() => nanoid()),
    // Reference to the resource
    resourceId: varchar('resource_id', { length: 191 }).references(
      () => resources.id,
      { onDelete: 'cascade' },
    ),
    // plain text of the chunk
    content: text('content').notNull(),

    // the vector representation of the plain text chunk
    // to do (?): To perform similarity search, you also need to include an index (HNSW or IVFFlat) on this column for better performance.
    embedding: vector('embedding', { dimensions: 1536 }).notNull(),
  },
  table => ({
    // index for the embedding using HNSW
    embeddingIndex: index('embeddingIndex').using(
      'hnsw',
      table.embedding.op('vector_cosine_ops'),
    ),
  }),
);