
import { useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Table, TableHead, TableBody, TableRow, TableCell } from '@/components/ui/table';

export default function ContentSpawner() {
  const [description, setDescription] = useState('');
  const [goal, setGoal] = useState('Engagement');
  const [platform, setPlatform] = useState('Mixed');
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);

  const generatePosts = async () => {
    setLoading(true);
    const res = await fetch('/api/spawn', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ description, goal, platform })
    });
    const data = await res.json();
    setPosts(data.posts || []);
    setLoading(false);
  };

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">📣 Content Spawner</h1>
      <Textarea
        placeholder="Describe your niche/product..."
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        rows={6}
      />

      <div className="flex gap-4">
        <Select value={goal} onValueChange={setGoal}>
          <SelectTrigger><SelectValue placeholder="Content Goal" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="Awareness">Awareness</SelectItem>
            <SelectItem value="Engagement">Engagement</SelectItem>
            <SelectItem value="Sales">Sales</SelectItem>
            <SelectItem value="Education">Education</SelectItem>
            <SelectItem value="Mixed">Mixed</SelectItem>
          </SelectContent>
        </Select>

        <Select value={platform} onValueChange={setPlatform}>
          <SelectTrigger><SelectValue placeholder="Platform Focus" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="TikTok">TikTok</SelectItem>
            <SelectItem value="Instagram">Instagram</SelectItem>
            <SelectItem value="Twitter">Twitter</SelectItem>
            <SelectItem value="Blog">Blog</SelectItem>
            <SelectItem value="Mixed">Mixed</SelectItem>
          </SelectContent>
        </Select>

        <Button onClick={generatePosts} disabled={loading}>
          {loading ? 'Generating...' : 'Generate Posts'}
        </Button>
      </div>

      {posts.length > 0 && (
        <div className="overflow-auto max-h-[600px] border rounded">
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Headline</TableCell>
                <TableCell>Hook</TableCell>
                <TableCell>CTA</TableCell>
                <TableCell>Platform</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {posts.map((post, i) => (
                <TableRow key={i}>
                  <TableCell>{post.headline}</TableCell>
                  <TableCell>{post.hook}</TableCell>
                  <TableCell>{post.cta}</TableCell>
                  <TableCell>{post.platform}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
