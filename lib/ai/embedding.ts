import { embed, embedMany } from 'ai';
import { openai } from '@ai-sdk/openai';
import { db } from '../db';
import { cosineDistance, desc, gt, sql } from 'drizzle-orm';
import { embeddings } from '../db/schema/embeddings';

const embeddingModel = openai.embedding('text-embedding-ada-002');

const generateChunks = (input: string): string[] => {
  return input
    .trim()
    .split('.')
    .filter(i => i !== '');
};


// Generate embeddings for a resource that you add to the knowledge base
export const generateEmbeddings = async (
  value: string,
): Promise<Array<{ embedding: number[]; content: string }>> => {
  const chunks = generateChunks(value);
  const { embeddings } = await embedMany({
    model: embeddingModel,
    values: chunks,
  });
  return embeddings.map((e, i) => ({ content: chunks[i], embedding: e }));
};

// Generate a single embedding from the chat input for a question

export const generateEmbedding = async (value: string): Promise<number[]> => {
  const input = value.replaceAll('\\n', ' ');
  console.log('\n========== CHAT INPUT EMBEDDING ==========');
  console.log('Original input:', value);
  console.log('Processed input:', input);
  
  const { embedding } = await embed({
    model: embeddingModel,
    value: input,
  });
  
  console.log('Generated embedding vector (first 10 values):', embedding.slice(0, 10));
  console.log('Embedding vector length:', embedding.length);
  console.log('==========================================\n');
  
  return embedding;
};

// Find relevant content from the knowledge base for a question
export const findRelevantContent = async (userQuery: string) => {
  console.log('\n========== DATABASE SIMILARITY SEARCH ==========');
  console.log('User query:', userQuery);
  
  const userQueryEmbedded = await generateEmbedding(userQuery);
  const similarity = sql<number>`1 - (${cosineDistance(
    embeddings.embedding,
    userQueryEmbedded,
  )})`;
  
  const similarGuides = await db
    .select({ name: embeddings.content, similarity })
    .from(embeddings)
    .where(gt(similarity, 0.5))
    .orderBy(t => desc(t.similarity))
    .limit(4);
  
  console.log('\nMatched database rows (before sending to LLM):');
  console.log('Total matches found:', similarGuides.length);
  
  if (similarGuides.length > 0) {
    similarGuides.forEach((guide, index) => {
      console.log(`\n  Match ${index + 1}:`);
      console.log(`    Content: "${guide.name}"`);
      console.log(`    Similarity score: ${guide.similarity}`);
    });
  } else {
    console.log('  No matches found with similarity > 0.5');
  }
  
  console.log('=================================================\n');
  
  return similarGuides;
};