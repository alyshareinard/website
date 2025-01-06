

import {type JSONSchema } from 'sveltekit-superforms';

export const loginSchema ={
    type: 'object',
    properties: {
      login: { type: 'string', minLength: 2 },
      password: { type: 'string', minLength: 2 },

    },
    required: ['login', 'password'],
    additionalProperties: false,
    $schema: 'http://json-schema.org/draft-07/schema#'
  } as const satisfies JSONSchema;