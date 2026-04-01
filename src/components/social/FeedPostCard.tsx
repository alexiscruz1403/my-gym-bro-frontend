'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Heart, MessageCircle } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { usePostInteraction } from '@/hooks/usePostInteraction';
import type { FeedPost } from '@/types/domain.types';

interface FeedPostCardProps {
  post: FeedPost;
  isOwnPost: boolean;
  onCommentOpen: (postId: string, onAdded: () => void) => void;
}

export function FeedPostCard({ post, isOwnPost, onCommentOpen }: FeedPostCardProps) {
  const { userReacted, reactionsCount, toggle } = usePostInteraction(
    post._id,
    post.userReacted,
    post.reactionsCount,
  );

  const [commentsCount, setCommentsCount] = useState(post.commentsCount);

  const initials = post.author.username.slice(0, 2).toUpperCase();
  const timeAgo = formatDistanceToNow(new Date(post.createdAt), { addSuffix: true });

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
          <Link href={`/users/${post.author._id}`}>
            <Avatar size="default">
              {post.author.avatar && (
                <AvatarImage src={post.author.avatar} alt={post.author.username} />
              )}
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
          </Link>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <Link
                href={`/users/${post.author._id}`}
                className="text-sm font-semibold hover:underline truncate"
              >
                {post.author.username}
              </Link>
              {isOwnPost && (
                <Badge variant="secondary" className="shrink-0">Your post</Badge>
              )}
            </div>
            <p className="text-xs text-muted-foreground">{timeAgo}</p>
          </div>
        </div>
      </CardHeader>

      {post.photoUrl && (
        <div className="relative w-full aspect-square overflow-hidden">
          <Image
            src={post.photoUrl}
            alt="Workout photo"
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 600px"
          />
        </div>
      )}

      {post.caption && (
        <CardContent>
          <p className="text-sm">{post.caption}</p>
        </CardContent>
      )}

      <CardFooter className="gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={toggle}
          className="flex items-center gap-1.5 min-h-11"
          aria-label={userReacted ? 'Remove reaction' : 'React to post'}
        >
          <Heart
            className={userReacted ? 'fill-destructive text-destructive' : ''}
          />
          <span className="text-sm">{reactionsCount}</span>
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => onCommentOpen(post._id, () => setCommentsCount((n) => n + 1))}
          className="flex items-center gap-1.5 min-h-11"
          aria-label="View comments"
        >
          <MessageCircle />
          <span className="text-sm">{commentsCount}</span>
        </Button>
      </CardFooter>
    </Card>
  );
}
