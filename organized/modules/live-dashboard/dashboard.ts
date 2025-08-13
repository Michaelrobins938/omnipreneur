// /pages/api/dashboard.ts
const mockData = [
  {
    title: "ADHD Toolkit Bundle",
    model: "Claude 3",
    score: 92,
    platform: "Gumroad",
    timestamp: Date.now() - 3600000
  },
  {
    title: "Chaos Planner",
    model: "GPT-4",
    score: 88,
    platform: "Etsy",
    timestamp: Date.now() - 7200000
  },
  {
    title: "Shadow Launch",
    model: "Command R+",
    score: 95,
    platform: "Notion",
    timestamp: Date.now() - 10800000
  }
];

export default function handler(req, res) {
  res.status(200).json(mockData);
}
