import { makeAPIRoute } from '@keystatic/astro/api';
import config from '../../../../keystatic.config';

export const ALL = makeAPIRoute({ config });
