
import { useState } from "react";
import Head from "next/head";

export default function Home() {
  const [keyword, setKeyword] = useState("");
  const [targetAudience, setTargetAudience] = useState("");
  const [contentType, setContentType] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult("");

    try {
      const response = await fetch("/api/generate-seo", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          keyword,
          targetAudience,
          contentType,
        }),
      });

      const data = await response.json();
      
      if (response.ok) {
        setResult(data.result);
      } else {
        setResult(`오류: ${data.error}`);
      }
    } catch (error) {
      setResult(`오류가 발생했습니다: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(result);
    alert("결과가 클립보드에 복사되었습니다!");
  };

  return (
    <div className="container">
      <Head>
        <title>AI SEO 콘텐츠 생성기</title>
        <meta name="description" content="AI를 활용한 SEO 콘텐츠 생성 도구" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="main">
        <h1>AI SEO 콘텐츠 생성기</h1>
        <p>키워드를 입력하고 SEO에 최적화된 콘텐츠 계획을 생성하세요.</p>

        <form onSubmit={handleSubmit} className="form">
          <label htmlFor="keyword">키워드 (필수)</label>
          <input
            id="keyword"
            type="text"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            required
            className="input"
            placeholder="예: 디지털 마케팅 전략"
          />

          <label htmlFor="targetAudience">대상 독자 (선택사항)</label>
          <input
            id="targetAudience"
            type="text"
            value={targetAudience}
            onChange={(e) => setTargetAudience(e.target.value)}
            className="input"
            placeholder="예: 마케팅 담당자"
          />

          <label htmlFor="contentType">콘텐츠 유형 (선택사항)</label>
          <input
            id="contentType"
            type="text"
            value={contentType}
            onChange={(e) => setContentType(e.target.value)}
            className="input"
            placeholder="예: 블로그 포스트"
          />

          <button type="submit" className="button" disabled={loading}>
            {loading ? "생성 중..." : "SEO 콘텐츠 계획 생성하기"}
          </button>
        </form>

        {loading && <p>AI가 콘텐츠 계획을 생성하고 있습니다. 잠시만 기다려주세요...</p>}

        {result && (
          <div className="result-container">
            <div className="result-header">
              <h2>생성된 SEO 콘텐츠 계획</h2>
              <button onClick={copyToClipboard} className="button">
                복사하기
              </button>
            </div>
            <div className="result">{result}</div>
          </div>
        )}
      </main>
    </div>
  );
}
