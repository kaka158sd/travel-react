const HighlightKeywords = (text, keywords) => {
  if (!text || !keywords || keywords.length === 0) return text;

  // 转义特殊字符并构建正则（全局匹配，不区分大小写)
  const escapedKeywords = keywords.map((k) =>
    k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'),
  );
  const regex = new RegExp(`(${escapedKeywords.join('|')})`, 'gi');

  // 分割文本并高亮
  return text.split(regex).map((part, index) =>
    keywords.some((k) => k.toLowerCase() === part.toLowerCase()) ? (
      <span key={index} className="text-blue-400">
        {part}
      </span>
    ) : (
      part
    ),
  );
};

export default HighlightKeywords;
