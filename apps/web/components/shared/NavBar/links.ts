import { Link } from '@/lib/types/components';

import Home from '@/components/icons/Home';
import Graph from '@/components/icons/Graph';
import Board from '@/components/icons/Board';

export const links: Link[] = [
  {
    id: 1,
    label: 'Home',
    link: '/home',
    Icon: Home,
  },
  {
    id: 2,
    label: 'Dashboard',
    link: '/dashboard',
    Icon: Graph,
  },
  {
    id: 3,
    label: 'Board',
    link: '/board',
    Icon: Board,
  },
];
