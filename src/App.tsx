import React, { useState, useCallback } from 'react';
import { Hash, Send, Smile, AlertCircle } from 'lucide-react';

const MAX_TWEET_LENGTH = 280;
const COMMON_EMOJIS = ['😊', '🎉', '👍', '🔥', '✨', '💡', '🌟', '💪', '🙌', '❤️'];

function App() {
  const [tweet, setTweet] = useState('');
  const [hashtags, setHashtags] = useState<string[]>([]);
  const [newHashtag, setNewHashtag] = useState('');

  const remainingChars = MAX_TWEET_LENGTH - (tweet.length + hashtags.join(' ').length);
  const isOverLimit = remainingChars < 0;

  const handleTweetChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTweet(e.target.value);
  };

  const handleHashtagSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newHashtag && !hashtags.includes(newHashtag)) {
      setHashtags([...hashtags, newHashtag]);
      setNewHashtag('');
    }
  };

  const removeHashtag = (tag: string) => {
    setHashtags(hashtags.filter(t => t !== tag));
  };

  const addEmoji = useCallback((emoji: string) => {
    setTweet(prev => prev + emoji);
  }, []);

  const getFinalTweet = () => {
    const hashtagString = hashtags.map(tag => `#${tag}`).join(' ');
    return `${tweet} ${hashtagString}`.trim();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          Xつぶやきジェネレーター
        </h1>

        {/* Tweet Input */}
        <div className="mb-6">
          <textarea
            value={tweet}
            onChange={handleTweetChange}
            className={`w-full p-4 border rounded-lg resize-none h-32 focus:ring-2 focus:ring-blue-300 focus:border-transparent ${
              isOverLimit ? 'border-red-500' : 'border-gray-200'
            }`}
            placeholder="つぶやきを入力してください..."
          />
          <div className={`text-right text-sm mt-2 ${
            isOverLimit ? 'text-red-500' : 'text-gray-500'
          }`}>
            残り {remainingChars} 文字
            {isOverLimit && (
              <span className="flex items-center justify-end gap-1">
                <AlertCircle className="w-4 h-4" />
                文字数制限を超えています
              </span>
            )}
          </div>
        </div>

        {/* Emoji Picker */}
        <div className="mb-6">
          <h2 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
            <Smile className="w-4 h-4" />
            絵文字を追加
          </h2>
          <div className="flex flex-wrap gap-2">
            {COMMON_EMOJIS.map(emoji => (
              <button
                key={emoji}
                onClick={() => addEmoji(emoji)}
                className="text-xl hover:scale-110 transition-transform p-2 rounded-lg hover:bg-gray-100"
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>

        {/* Hashtag Input */}
        <div className="mb-6">
          <h2 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
            <Hash className="w-4 h-4" />
            ハッシュタグ
          </h2>
          <form onSubmit={handleHashtagSubmit} className="flex gap-2 mb-3">
            <input
              type="text"
              value={newHashtag}
              onChange={(e) => setNewHashtag(e.target.value)}
              className="flex-1 p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-300 focus:border-transparent"
              placeholder="ハッシュタグを入力..."
            />
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              追加
            </button>
          </form>
          <div className="flex flex-wrap gap-2">
            {hashtags.map(tag => (
              <span
                key={tag}
                className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full"
              >
                #{tag}
                <button
                  onClick={() => removeHashtag(tag)}
                  className="hover:text-blue-600"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* Preview */}
        <div className="mb-6">
          <h2 className="text-sm font-semibold text-gray-700 mb-2">プレビュー</h2>
          <div className="p-4 bg-gray-50 rounded-lg whitespace-pre-wrap break-words">
            {getFinalTweet() || 'プレビューはここに表示されます'}
          </div>
        </div>

        {/* Copy Button */}
        <button
          onClick={() => navigator.clipboard.writeText(getFinalTweet())}
          disabled={isOverLimit || !tweet}
          className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          <Send className="w-5 h-5" />
          クリップボードにコピー
        </button>
      </div>
    </div>
  );
}

export default App;