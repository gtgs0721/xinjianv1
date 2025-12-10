
import { Inspiration, DailyWisdom, Challenge, SocialPost } from './types';

export const MOCK_INSPIRATIONS: Inspiration[] = [
  {
    id: '1',
    content: "竹影扫阶尘不动，月轮穿沼水无痕。",
    date: '2023-10-01',
    tags: ['禅意', '静谧', '自然'],
    mood: 'peaceful',
    imagery: ['竹', '台阶', '尘埃'],
    connections: ['2', '3', '6']
  },
  {
    id: '2',
    content: "月光如积水空明，水中藻、荇交横，盖竹柏影也。",
    date: '2023-10-02',
    tags: ['清澈', '夜', '水'],
    mood: 'melancholic',
    imagery: ['月', '水', '竹影'],
    imageUrl: 'https://picsum.photos/400/300',
    connections: ['1', '7', '8']
  },
  {
    id: '3',
    content: "听雨入孤舟，点滴在心头。",
    date: '2023-10-05',
    tags: ['孤独', '声', '雨'],
    mood: 'melancholic',
    imagery: ['雨', '舟'],
    connections: ['1', '9']
  },
  {
    id: '4',
    content: "春风又绿江南岸，明月何时照我还。",
    date: '2023-10-08',
    tags: ['希望', '新生', '春'],
    mood: 'joyful',
    imagery: ['风', '江', '草'],
    connections: ['10', '11']
  },
  {
    id: '5',
    content: "云深不知处，只在此山中。",
    date: '2023-10-10',
    tags: ['神秘', '远方', '山'],
    mood: 'anxious',
    imagery: ['云', '山'],
    connections: ['6']
  },
  {
    id: '6',
    content: "晴空一鹤排云上，便引诗情到碧霄。",
    date: '2023-10-12',
    tags: ['自由', '自然', '禅'],
    mood: 'peaceful',
    imagery: ['鹤', '天'],
    connections: ['1', '5']
  },
  {
    id: '7',
    content: "茶烟轻飏落花风。",
    date: '2023-10-13',
    tags: ['日常', '水', '静'],
    mood: 'peaceful',
    imagery: ['茶', '花'],
    connections: ['2']
  },
  {
    id: '8',
    content: "夜深风竹敲秋韵，万叶千声皆是恨。",
    date: '2023-10-14',
    tags: ['夜', '路', '光'],
    mood: 'melancholic',
    imagery: ['灯', '径'],
    connections: ['2', '9']
  },
  {
    id: '9',
    content: "清泉石上流。",
    date: '2023-10-15',
    tags: ['雨', '质感', '自然'],
    mood: 'neutral',
    imagery: ['石', '暴风雨'],
    connections: ['3', '8']
  },
  {
    id: '10',
    content: "人面桃花相映红。",
    date: '2023-10-16',
    tags: ['春', '喜悦', '花'],
    mood: 'joyful',
    imagery: ['桃花', '风'],
    connections: ['4']
  },
  {
    id: '11',
    content: "万条垂下绿丝绦。",
    date: '2023-10-17',
    tags: ['春', '动感', '树'],
    mood: 'joyful',
    imagery: ['柳', '丝'],
    connections: ['4', '10']
  },
  {
    id: '12',
    content: "闲敲棋子落灯花。",
    date: '2023-10-18',
    tags: ['记忆', '物', '书房'],
    mood: 'neutral',
    imagery: ['书', '桌'],
    connections: ['1']
  },
  {
    id: '13',
    content: "姑苏城外寒山寺，夜半钟声到客船。",
    date: '2023-10-19',
    tags: ['声', '禅', '远方'],
    mood: 'peaceful',
    imagery: ['钟', '寺'],
    connections: ['1', '3', '5']
  }
];

export const DAILY_WISDOM: DailyWisdom = {
  term: "白露",
  quote: "蒹葭苍苍，白露为霜。",
  author: "诗经"
};

export const MOCK_CHALLENGES: Challenge[] = [
  {
    id: 'c1',
    date: new Date().toISOString().split('T')[0],
    title: "须臾",
    prompt: "描述一个只持续了五秒钟，却让你感觉永恒的瞬间。",
    theme: "观察",
    completed: false
  },
  {
    id: 'c2',
    date: '2023-10-24',
    title: "风语",
    prompt: "当冷风拂面时，你想起了什么往事？",
    theme: "记忆",
    completed: true
  },
  {
    id: 'c3',
    date: '2023-10-23',
    title: "光影",
    prompt: "观察此刻房间里的光影，它们构成了什么形状？",
    theme: "观察",
    completed: true
  },
  {
    id: 'c4',
    date: '2023-10-22',
    title: "寂声",
    prompt: "描述你今天听到过的最安静的声音。",
    theme: "感官",
    completed: false
  },
  {
    id: 'c5',
    date: '2023-10-21',
    title: "心色",
    prompt: "如果你此刻的心情是一种兑了水的颜色，那会是什么？",
    theme: "想象",
    completed: true
  }
];

export const MOCK_SOCIAL_POSTS: SocialPost[] = [
  {
    id: 's1',
    author: '林居',
    avatar: 'https://picsum.photos/100/100?random=88',
    content: "晨雾拥抱着城市的轮廓，柔化了现实的棱角。",
    date: '2小时前',
    likes: 42,
    isLiked: false,
    tags: ['城市', '雾']
  },
  {
    id: 's2',
    author: '云栖',
    avatar: 'https://picsum.photos/100/100?random=99',
    content: "旧书信里掉落的干花，墨迹已淡，相思未减。",
    date: '5小时前',
    likes: 128,
    isLiked: true,
    tags: ['记忆', '书']
  },
  {
    id: 's3',
    author: '静川',
    avatar: 'https://picsum.photos/100/100?random=77',
    content: "茶叶在沸水中舒展，一场缓慢的苏醒。",
    date: '昨天',
    likes: 35,
    isLiked: false,
    tags: ['茶', '禅']
  }
];
