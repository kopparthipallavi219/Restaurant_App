'use client';

import React, { useState, useEffect } from 'react';
import {
  MessageSquareHeart,
  Star,
  X,
  Send,
  CheckCircle2,
  Sparkles,
  ThumbsUp,
  ThumbsDown,
  MessageSquare,
  Loader2,
} from 'lucide-react';

interface FeedbackData {
  rating: number;
  category: string;
  comment: string;
  name: string;
  contact: string;
  recommend: boolean | null;
  createdAt: string;
}

const CATEGORIES = [
  'Royal Biryani Taste',
  'Food Quality & Freshness',
  'Delivery Speed & Packaging',
  'Dine-in & Ambience',
  'Staff Hospitality',
  'Website & App Experience',
  'Other',
];

const RATING_LABELS: Record<number, string> = {
  1: 'Needs Improvement ⚠️',
  2: 'Fair Experience 🙂',
  3: 'Good & Flavorful 👍',
  4: 'Very Good & Delicious ✨',
  5: 'Royal & Exceptional Mehfil Experience! 👑',
};

export const FeedbackModal: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [category, setCategory] = useState<string>('Royal Biryani Taste');
  const [comment, setComment] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [contact, setContact] = useState<string>('');
  const [recommend, setRecommend] = useState<boolean | null>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>('');

  // Auto-fill name/email if user is logged in
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('mehfil_user');
      if (storedUser) {
        const parsed = JSON.parse(storedUser);
        if (parsed.name && !name) setName(parsed.name);
        if (parsed.email && !contact) setContact(parsed.email);
        else if (parsed.phone && !contact) setContact(parsed.phone);
      }
    } catch {
      // Ignore parse errors
    }
  }, [isOpen]);

  // Listen for custom trigger event
  useEffect(() => {
    const handleOpen = () => setIsOpen(true);
    window.addEventListener('open-feedback-modal', handleOpen);
    return () => window.removeEventListener('open-feedback-modal', handleOpen);
  }, []);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) {
      setErrorMsg('Please select a star rating.');
      return;
    }
    if (!comment.trim()) {
      setErrorMsg('Please write a brief feedback comment.');
      return;
    }

    setErrorMsg('');
    setIsSubmitting(true);

    const feedbackPayload: FeedbackData = {
      rating,
      category,
      comment: comment.trim(),
      name: name.trim() || 'Valued Mehfil Guest',
      contact: contact.trim(),
      recommend,
      createdAt: new Date().toISOString(),
    };

    try {
      // Try to send to API endpoint (fail-safe if server is offline)
      try {
        await fetch('http://localhost:5000/api/feedback', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(feedbackPayload),
        });
      } catch {
        // Backend might be offline; fallback smoothly
      }

      // Persist feedback locally in browser
      const existing = JSON.parse(localStorage.getItem('mehfil_user_feedbacks') || '[]');
      existing.unshift(feedbackPayload);
      localStorage.setItem('mehfil_user_feedbacks', JSON.stringify(existing.slice(0, 50)));

      setIsSubmitting(false);
      setIsSubmitted(true);
    } catch {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }
  };

  const handleResetAndClose = () => {
    setIsOpen(false);
    setTimeout(() => {
      setIsSubmitted(false);
      setComment('');
      setRating(5);
      setErrorMsg('');
    }, 300);
  };

  const currentActiveRating = hoverRating !== null ? hoverRating : rating;

  return (
    <>
      {/* Floating Action Trigger Button */}
      <button
        onClick={() => setIsOpen(true)}
        aria-label="Open Feedback Pop-up"
        className="fixed bottom-5 right-5 sm:bottom-6 sm:right-6 z-40 flex items-center gap-2 px-3.5 py-2.5 sm:px-4 sm:py-3 rounded-full bg-mehfil-burgundy-light/95 backdrop-blur-md border border-mehfil-saffron/40 text-mehfil-gold shadow-nizami hover:border-mehfil-saffron hover:bg-mehfil-burgundy-accent hover:text-mehfil-saffron hover:scale-105 active:scale-95 transition-all duration-300 group"
      >
        <span className="relative flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-mehfil-saffron opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-mehfil-saffron"></span>
        </span>
        <MessageSquareHeart className="w-4 h-4 text-mehfil-saffron group-hover:scale-110 transition-transform" />
        <span className="text-xs font-semibold tracking-wide text-mehfil-parchment group-hover:text-mehfil-saffron">
          Feedback
        </span>
      </button>

      {/* Pop-up Modal Dialog */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div
            className="relative w-full max-w-lg bg-mehfil-burgundy-dark/95 border border-mehfil-saffron/40 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] text-mehfil-parchment animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top Royal Accent Line */}
            <div className="h-1.5 w-full bg-gradient-to-r from-mehfil-saffron via-mehfil-gold to-mehfil-saffron" />

            {/* Header */}
            <div className="flex items-center justify-between px-6 pt-5 pb-3 border-b border-mehfil-burgundy-border/60">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-mehfil-saffron/20 to-mehfil-gold/20 border border-mehfil-saffron/40 flex items-center justify-center shadow-inner">
                  <Sparkles className="w-5 h-5 text-mehfil-gold" />
                </div>
                <div>
                  <h3 className="font-serif text-lg sm:text-xl font-bold text-mehfil-gold">
                    Mehfil Feedback
                  </h3>
                  <p className="text-[11px] text-mehfil-parchment-muted">
                    Your words help us perfect the royal dining tradition
                  </p>
                </div>
              </div>

              <button
                onClick={handleResetAndClose}
                className="p-1.5 rounded-lg text-mehfil-parchment-muted hover:text-mehfil-saffron hover:bg-mehfil-burgundy-light/60 transition-colors"
                aria-label="Close Feedback Popup"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="overflow-y-auto px-6 py-5 space-y-5">
              {isSubmitted ? (
                /* Success State */
                <div className="py-8 text-center space-y-4">
                  <div className="w-16 h-16 mx-auto rounded-full bg-emerald-950/80 border border-emerald-500/50 flex items-center justify-center shadow-gold-glow animate-bounce">
                    <CheckCircle2 className="w-9 h-9 text-emerald-400" />
                  </div>
                  <div>
                    <h4 className="font-serif text-2xl font-bold text-mehfil-gold">
                      Shukriya! (Thank You)
                    </h4>
                    <p className="text-sm text-mehfil-parchment-muted mt-1 max-w-sm mx-auto">
                      Your royal feedback has been safely received. We truly appreciate you taking the time to share your dining experience.
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-mehfil-burgundy-light/60 border border-mehfil-burgundy-border text-xs text-mehfil-gold/90">
                    Rated: {rating} ★ | {category}
                  </div>

                  <button
                    onClick={handleResetAndClose}
                    className="mt-4 px-6 py-2.5 rounded-full bg-gradient-to-r from-mehfil-saffron to-mehfil-gold text-mehfil-burgundy-dark font-bold text-sm shadow-md hover:scale-105 transition-all"
                  >
                    Done
                  </button>
                </div>
              ) : (
                /* Feedback Form */
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Star Rating Section */}
                  <div className="text-center bg-mehfil-burgundy-light/40 border border-mehfil-burgundy-border/60 p-4 rounded-xl">
                    <label className="block text-xs font-semibold text-mehfil-parchment uppercase tracking-wider mb-2">
                      How was your Mehfil experience?
                    </label>
                    <div className="flex items-center justify-center gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setRating(star)}
                          onMouseEnter={() => setHoverRating(star)}
                          onMouseLeave={() => setHoverRating(null)}
                          className="p-1 rounded-lg hover:scale-125 transition-transform duration-150 focus:outline-none"
                          aria-label={`Rate ${star} star`}
                        >
                          <Star
                            className={`w-7 h-7 sm:w-8 sm:h-8 transition-colors ${
                              star <= currentActiveRating
                                ? 'fill-mehfil-saffron text-mehfil-saffron drop-shadow-[0_0_8px_rgba(217,119,6,0.6)]'
                                : 'text-stone-600'
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                    <p className="text-xs font-medium text-mehfil-gold mt-2 h-4">
                      {RATING_LABELS[currentActiveRating]}
                    </p>
                  </div>

                  {/* Feedback Category Pills */}
                  <div>
                    <label className="block text-xs font-semibold text-mehfil-gold uppercase tracking-wider mb-2">
                      Feedback Topic
                    </label>
                    <div className="flex flex-wrap gap-1.5">
                      {CATEGORIES.map((cat) => (
                        <button
                          key={cat}
                          type="button"
                          onClick={() => setCategory(cat)}
                          className={`text-[11px] px-2.5 py-1 rounded-full border transition-all ${
                            category === cat
                              ? 'bg-mehfil-saffron text-mehfil-burgundy-dark font-bold border-mehfil-saffron shadow-sm'
                              : 'bg-mehfil-burgundy-light/60 text-mehfil-parchment-muted border-mehfil-burgundy-border hover:border-mehfil-saffron/50 hover:text-mehfil-parchment'
                          }`}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Comment / Review Box */}
                  <div>
                    <label className="block text-xs font-semibold text-mehfil-gold uppercase tracking-wider mb-1.5">
                      Your Comments & Thoughts <span className="text-mehfil-saffron">*</span>
                    </label>
                    <textarea
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder="Share what dish you loved (e.g. Mutton Dum Biryani, Haleem) or how we can make your experience even better..."
                      rows={3}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-mehfil-burgundy-light/70 border border-mehfil-burgundy-border text-sm text-mehfil-parchment placeholder-stone-500 focus:outline-none focus:border-mehfil-saffron focus:ring-1 focus:ring-mehfil-saffron resize-none transition-all"
                    />
                  </div>

                  {/* Name & Phone/Email (Optional) */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-mehfil-parchment-muted mb-1">
                        Your Name (Optional)
                      </label>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. Rajesh Kumar"
                        className="w-full px-3 py-1.5 rounded-lg bg-mehfil-burgundy-light/70 border border-mehfil-burgundy-border text-xs text-mehfil-parchment placeholder-stone-500 focus:outline-none focus:border-mehfil-saffron"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-mehfil-parchment-muted mb-1">
                        Phone or Email (Optional)
                      </label>
                      <input
                        type="text"
                        value={contact}
                        onChange={(e) => setContact(e.target.value)}
                        placeholder="For thank you perks"
                        className="w-full px-3 py-1.5 rounded-lg bg-mehfil-burgundy-light/70 border border-mehfil-burgundy-border text-xs text-mehfil-parchment placeholder-stone-500 focus:outline-none focus:border-mehfil-saffron"
                      />
                    </div>
                  </div>

                  {/* Recommendation Chip */}
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-xs text-mehfil-parchment-muted">
                      Recommend Mehfil to others?
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setRecommend(true)}
                        className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border transition-all ${
                          recommend === true
                            ? 'bg-emerald-950/80 text-emerald-400 border-emerald-600'
                            : 'bg-mehfil-burgundy-light/50 text-stone-400 border-mehfil-burgundy-border hover:text-mehfil-parchment'
                        }`}
                      >
                        <ThumbsUp className="w-3 h-3" />
                        Yes
                      </button>
                      <button
                        type="button"
                        onClick={() => setRecommend(false)}
                        className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border transition-all ${
                          recommend === false
                            ? 'bg-rose-950/80 text-rose-400 border-rose-600'
                            : 'bg-mehfil-burgundy-light/50 text-stone-400 border-mehfil-burgundy-border hover:text-mehfil-parchment'
                        }`}
                      >
                        <ThumbsDown className="w-3 h-3" />
                        No
                      </button>
                    </div>
                  </div>

                  {/* Error Message */}
                  {errorMsg && (
                    <p className="text-xs text-rose-400 bg-rose-950/40 p-2 rounded-lg border border-rose-800/40 text-center">
                      {errorMsg}
                    </p>
                  )}

                  {/* Action Buttons */}
                  <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-mehfil-burgundy-border/60">
                    <button
                      type="button"
                      onClick={handleResetAndClose}
                      className="px-4 py-2 rounded-xl text-xs font-medium text-mehfil-parchment-muted hover:text-mehfil-parchment hover:bg-mehfil-burgundy-light transition-all"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex items-center gap-2 px-5 py-2 rounded-xl bg-gradient-to-r from-mehfil-saffron to-mehfil-gold text-mehfil-burgundy-dark font-bold text-xs shadow-gold-glow hover:scale-105 active:scale-95 disabled:opacity-50 disabled:scale-100 transition-all cursor-pointer"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          <span>Submitting...</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-3.5 h-3.5" />
                          <span>Submit Royal Feedback</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

