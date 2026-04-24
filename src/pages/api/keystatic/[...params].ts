import { handleRequests } from '@keystatic/astro/api';
import config from '../../../../keystatic.config';

export const ALL = handleRequests({ config });

