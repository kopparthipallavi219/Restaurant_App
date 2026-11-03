import { Router, Request, Response } from 'express';

const router = Router();

// In-memory store fallback
const feedbackStore: Array<{
  id: string;
  rating: number;
  category: string;
  comment: string;
  name: string;
  contact: string;
  recommend: boolean | null;
  createdAt: string;
}> = [];

router.post('/', (req: Request, res: Response) => {
  try {
    const { rating, category, comment, name, contact, recommend } = req.body;
    const newFeedback = {
      id: `fb_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      rating: Number(rating) || 5,
      category: category || 'General',
      comment: String(comment || ''),
      name: String(name || 'Valued Mehfil Guest'),
      contact: String(contact || ''),
      recommend: recommend !== undefined ? Boolean(recommend) : null,
      createdAt: new Date().toISOString(),
    };

    feedbackStore.unshift(newFeedback);
    console.log(
      `⭐ Royal Feedback Received: ${newFeedback.rating}★ [${newFeedback.category}] by ${newFeedback.name} - "${newFeedback.comment.substring(0, 60)}"`
    );

    res.status(201).json({
      success: true,
      message: 'Royal feedback received successfully. Shukriya!',
      data: newFeedback,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to record feedback',
    });
  }
});

router.get('/', (_req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    count: feedbackStore.length,
    data: feedbackStore,
  });
});

export default router;

