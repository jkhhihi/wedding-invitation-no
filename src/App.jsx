import React, { useState, useEffect, useRef, useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";


/* =========================================================================
   📷 메인 커버 사진 (base64 임베드)
   교체 시 이 상수만 새 data URL로 갈아끼우면 됩니다.
   ========================================================================= */
const COVER_PHOTO = "/images/main.jpg"

/* =========================================================================
   📷 갤러리 사진 (base64 임베드, 9장)
   ========================================================================= */
const GALLERY_0 = "/images/0.jpg"
const GALLERY_1 = "/images/1.jpg"
const GALLERY_2 = "/images/2.jpg"
const GALLERY_3 = "/images/3.jpg"
const GALLERY_4 = "/images/4.jpg"
const GALLERY_5 = "/images/5.jpg"
const GALLERY_6 = "/images/6.jpg"
const GALLERY_7 = "/images/7.jpg"
const GALLERY_8 = "/images/8.jpg"

const GALLERY_PHOTOS = [
  GALLERY_0, GALLERY_1, GALLERY_2,
  GALLERY_3, GALLERY_4, GALLERY_5,
  GALLERY_6, GALLERY_7, GALLERY_8,
];

/* =========================================================================
   🗺️  오시는 길 약도 (base64 임베드)
   ========================================================================= */
const MAP_IMAGE = "/images/map.jpg";

/* =========================================================================
   📝 청첩장 데이터 — 이 부분만 수정하면 본인 청첩장으로 바뀝니다
   ========================================================================= */
const data = {
  // 메인 커버
  cover: {
    dateLine: "2026년 09월 06일 (일) 오후 1시",
    venueLine: "남산골한옥마을 (관훈동 민씨 가옥)",
    groomFirst: "기훈",
    brideFirst: "연지",
    photo: COVER_PHOTO,
  },

  // 결혼식 일시
  weddingDate: "2026-09-06T13:00:00+09:00",
  weddingDateLabel: "26년 9월 6일 (일) 오후 1시",

  // 인사말
  greeting: {
    title: "초대합니다",
    body: [
      "기쁘나 슬프나 두 사람이 서로의 손을 맞잡고,",
      "훈훈한 사랑으로 앞으로의 날들을 채워가려 합니다.",
      "연을 맺은 이 순간을 소중히 간직해,",
      "지금처럼 서로를 아끼면서 함께 걸어가겠습니다.",
    ],
  },

  // 신랑/신부 정보
  groom: {
    name: "정기훈",
    firstName: "기훈",
    phone: "01093559129",
    father: "정원섭",
    mother: "서명순",
  },
  bride: {
    name: "남연지",
    firstName: "연지",
    phone: "01097761703",
    father: "남효병",
    mother: "양정선",
  },

  // 갤러리 (실제 사진 URL로 교체)
  gallery: GALLERY_PHOTOS,

  // 오시는 길
  venue: {
    name: "남산골한옥마을",
    hall: "관훈동 민씨 가옥",
    address: "서울 중구 퇴계로34길 28",
    naverMapUrl: "https://naver.me/5gFg3FmY",
    kakaoMapUrl: "https://kko.to/L14AiN-mEJ",
    transit: [
      {
        title: "지하철 안내",
        lines: [
          "충무로역 3번 출구 (도보 5분)",
        ],
      },
      {
        title: "자가용 안내",
        lines: [
          "아래 유료 주차장 이용 가능",
          "남산한옥마을 공영주차장",
          "동국대학교 충무로 영상센터 주차장",
          "대한극장 주차장",
        ],
      },
      {
        title: "대절 버스 안내",
        lines: [
          "오전 7시 30분 출발 (대구 ↔ 서울)",
          "탑승 장소: 어린이세상 (구, 어린이회관)",
        ],
      },
      {
        title: "안내 사항",
        lines: [
          "화환은 반입이 불가하여 정중히 사양합니다",
          "따뜻한 마음만 감사히 받겠습니다",
          "전용주차장이 없으니 가급적 대중교통을 이용해주시기 바랍니다",
        ],
      },
    ],
  },

  // 마음 전하실 곳
  accounts: {
    groom: [
      { role: "신랑", bank: "신한은행", owner: "정기훈", number: "110-243-372109" },
      { role: "신랑 아버지", bank: "신한은행", owner: "정원섭", number: "613-13-027171" },
      { role: "신랑 어머니", bank: "신한은행", owner: "서명순", number: "110-418-837010" },
    ],
    bride: [
      { role: "신부", bank: "신한은행", owner: "남연지", number: "110-266-276520" },
      { role: "신부 아버지", bank: "iM뱅크", owner: "남효병", number: "074-08-036051-4" },
      { role: "신부 어머니", bank: "iM뱅크", owner: "양정선", number: "164-13-128628" },
    ],
  },
};

/* =========================================================================
   디자인 토큰
   ========================================================================= */
const palette = {
  bg: "#f7f3ec",            // 크림 베이스
  paper: "#fbf8f2",         // 카드 배경
  ink: "#3a3530",           // 본문
  inkSoft: "#7a716a",       // 보조 텍스트
  accent: "#9e8866",        // 머스타드 베이지
  rule: "#e2dccf",          // 구분선
  sage: "#9aa68d",          // 세이지 그린
};

const fontDisplay =
  '"Noto Serif KR", "Nanum Myeongjo", ui-serif, Georgia, serif';
const fontBody =
  '"Noto Sans KR", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';

/* =========================================================================
   유틸: 스크롤 페이드인
   ========================================================================= */
function useReveal() {
  const ref = useRef(null);
  const [shown, setShown] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            setShown(true);
            io.disconnect();
          }
        });
      },
      { threshold: 0.15 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return [ref, shown];
}

function Reveal({ children, delay = 0 }) {
  const [ref, shown] = useReveal();
  return (
    <div
      ref={ref}
      style={{
        opacity: shown ? 1 : 0,
        transform: shown ? "translateY(0)" : "translateY(16px)",
        transition: `opacity 900ms ease ${delay}ms, transform 900ms ease ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

/* =========================================================================
   장식: 미니멀 식물 SVG
   ========================================================================= */
function Botanical({ size = 60, color = palette.sage, flip = false }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      style={{ transform: flip ? "scaleX(-1)" : "none" }}
      aria-hidden
    >
      <g fill="none" stroke={color} strokeWidth="0.9" strokeLinecap="round">
        <path d="M50 95 C 50 70, 50 40, 50 10" />
        <path d="M50 80 C 35 75, 28 65, 28 55" />
        <ellipse cx="28" cy="55" rx="9" ry="4" fill={color} fillOpacity="0.18" />
        <path d="M50 65 C 65 60, 72 50, 72 40" />
        <ellipse cx="72" cy="40" rx="9" ry="4" fill={color} fillOpacity="0.18" />
        <path d="M50 50 C 38 45, 32 35, 32 25" />
        <ellipse cx="32" cy="25" rx="8" ry="3.5" fill={color} fillOpacity="0.18" />
        <path d="M50 35 C 60 30, 66 22, 66 14" />
        <ellipse cx="66" cy="14" rx="7" ry="3" fill={color} fillOpacity="0.18" />
      </g>
    </svg>
  );
}

/* =========================================================================
   사진 자리 (실제 사진이 없을 때 보여주는 placeholder)
   ========================================================================= */
function PhotoPlaceholder({ src, alt = "wedding photo", aspect = "1 / 1", onClick }) {
  if (src) {
    return (
      <div
        onClick={onClick}
        style={{
          aspectRatio: aspect,
          backgroundImage: `url(${src})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          cursor: onClick ? "pointer" : "default",
        }}
      />
    );
  }
  return (
    <div
      onClick={onClick}
      style={{
        aspectRatio: aspect,
        background:
          "linear-gradient(135deg, #efe8da 0%, #e2d8c2 50%, #d8cdb3 100%)",
        position: "relative",
        overflow: "hidden",
        cursor: onClick ? "pointer" : "default",
      }}
      aria-label={alt}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          gap: 8,
          color: palette.accent,
          fontFamily: fontBody,
          fontSize: 11,
          letterSpacing: "0.3em",
        }}
      >
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
          <rect x="3" y="5" width="18" height="14" rx="2" />
          <circle cx="8.5" cy="10.5" r="1.5" />
          <path d="M21 17l-5-5-9 9" />
        </svg>
        <span>PHOTO</span>
      </div>
    </div>
  );
}

/* =========================================================================
   섹션 타이틀
   ========================================================================= */
function SectionTitle({ eyebrow, title }) {
  return (
    <div style={{ textAlign: "center", marginBottom: 32 }}>
      {eyebrow && (
        <div
          style={{
            fontFamily: fontBody,
            fontSize: 11,
            letterSpacing: "0.4em",
            color: palette.accent,
            marginBottom: 12,
          }}
        >
          {eyebrow}
        </div>
      )}
      <h2
        style={{
          fontFamily: fontDisplay,
          fontWeight: 400,
          fontSize: 24,
          color: palette.ink,
          margin: 0,
          letterSpacing: "0.1em",
        }}
      >
        {title}
      </h2>
      <div
        style={{
          width: 24,
          height: 1,
          background: palette.accent,
          margin: "16px auto 0",
        }}
      />
    </div>
  );
}

/* =========================================================================
   메인 커버
   ========================================================================= */
function Cover() {
  return (
    <section
      style={{
        position: "relative",
        padding: "0",
        textAlign: "center",
        overflow: "hidden",
      }}
    >
      {/* 상단 장식 */}



      {/* 메인 사진 */}
      <div
  style={{
    width: "100%",
    height: "80vh",
    backgroundImage: `url(${data.cover.photo})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    marginBottom: 40,
  }}
/>

      {/* 이름 */}
      <div
        style={{
          fontFamily: fontDisplay,
          fontSize: 34,
          color: palette.ink,
          letterSpacing: "0.05em",
          lineHeight: 1.4,
        }}
      >
        {data.cover.groomFirst}
        <span style={{ color: palette.accent, margin: "0 14px", fontSize: 22 }}>
          ♥
        </span>
        {data.cover.brideFirst}
      </div>

      {/* 날짜 */}
      <div
        style={{
          marginTop: 28,
          fontFamily: fontBody,
          fontSize: 13,
          color: palette.inkSoft,
          letterSpacing: "0.15em",
        }}
      >
        {data.cover.dateLine}
      </div>
      <div
        style={{
          marginTop: 6,
          fontFamily: fontBody,
          fontSize: 12,
          color: palette.inkSoft,
        }}
      >
        {data.cover.venueLine}
      </div>
    </section>
  );
}

/* =========================================================================
   D-day 카운트다운
   ========================================================================= */
function Countdown() {
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);

  const diff = new Date(data.weddingDate).getTime() - now;
  const past = diff <= 0;
  const abs = Math.abs(diff);
  const days = Math.floor(abs / 86400000);
  const hours = Math.floor((abs % 86400000) / 3600000);
  const mins = Math.floor((abs % 3600000) / 60000);
  const secs = Math.floor((abs % 60000) / 1000);

  const pad = (n) => String(n).padStart(2, "0");

  const cells = [
    { label: "DAYS", value: days },
    { label: "HOUR", value: pad(hours) },
    { label: "MIN", value: pad(mins) },
    { label: "SEC", value: pad(secs) },
  ];

  return (
    <section style={{ padding: "20px 24px 48px", textAlign: "center" }}>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: 8,
          maxWidth: 320,
          margin: "0 auto",
        }}
      >
        {cells.map((c) => (
          <div
            key={c.label}
            style={{
              padding: "14px 0",
              background: palette.paper,
              border: `1px solid ${palette.rule}`,
            }}
          >
            <div
              style={{
                fontFamily: fontDisplay,
                fontSize: 22,
                color: palette.ink,
                lineHeight: 1,
              }}
            >
              {c.value}
            </div>
            <div
              style={{
                marginTop: 6,
                fontFamily: fontBody,
                fontSize: 9,
                letterSpacing: "0.3em",
                color: palette.accent,
              }}
            >
              {c.label}
            </div>
          </div>
        ))}
      </div>
      <div
        style={{
          marginTop: 16,
          fontFamily: fontBody,
          fontSize: 12,
          color: palette.inkSoft,
        }}
      >
        {past
          ? "결혼식이 시작되었습니다 💐"
          : `${data.cover.groomFirst} · ${data.cover.brideFirst}의 결혼식이 ${days}일 남았습니다`}
      </div>
    </section>
  );
}

/* =========================================================================
   인사말
   ========================================================================= */
function Greeting() {
  return (
    <section style={{ padding: "48px 28px" }}>
      <Reveal>
        <SectionTitle eyebrow="GREETINGS" title={data.greeting.title} />
        <div
          style={{
            textAlign: "center",
            fontFamily: fontDisplay,
            fontSize: 15,
            lineHeight: 2.2,
            color: palette.ink,
            letterSpacing: "0.02em",
          }}
        >
          {data.greeting.body.map((line, i) => (
            <div key={i}>{line}</div>
          ))}
        </div>

        {/* 혼주 — 부모 + 자녀 표기 */}
        <div
          style={{
            marginTop: 36,
            display: "flex",
            flexDirection: "column",
            gap: 12,
            alignItems: "center",
            fontFamily: fontDisplay,
            fontSize: 14,
            color: palette.ink,
            letterSpacing: "0.02em",
          }}
        >
          <ParentRow
            father={data.groom.father}
            mother={data.groom.mother}
            relation="아들"
            child={data.groom.firstName}
          />
          <ParentRow
            father={data.bride.father}
            mother={data.bride.mother}
            relation="딸"
            child={data.bride.firstName}
          />
        </div>
      </Reveal>
    </section>
  );
}

function ParentRow({ father, mother, relation, child }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
      }}
    >
      {/* 부모 두 줄 — 고정 너비, 오른쪽 정렬 */}
      <div
        style={{
          textAlign: "right",
          lineHeight: 1.5,
          fontSize: 13,
          width: 56,
        }}
      >
        <div>{father}</div>
        <div>{mother}</div>
      </div>

      {/* 의 */}
      <div style={{ fontSize: 12, color: palette.inkSoft }}>의</div>

      {/* 관계 (아들/딸) — 고정 너비로 통일 */}
      <div
        style={{
          fontSize: 13,
          color: palette.inkSoft,
          width: 24,
          textAlign: "center",
        }}
      >
        {relation}
      </div>

      {/* 자녀 이름 — 왼쪽 정렬 */}
      <div
        style={{
          fontSize: 17,
          color: palette.ink,
          letterSpacing: "0.05em",
          fontWeight: 500,
          width: 48,
          textAlign: "left",
        }}
      >
        {child}
      </div>
    </div>
  );
}

/* =========================================================================
   신랑신부 / 혼주 정보
   ========================================================================= */
function ContactRow({ name, phone, label }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "10px 0",
      }}
    >
      <div style={{ display: "flex", alignItems: "baseline", gap: 12 }}>
        {label && (
          <span
            style={{
              fontFamily: fontBody,
              fontSize: 11,
              color: palette.inkSoft,
              minWidth: 36,
            }}
          >
            {label}
          </span>
        )}
        <span
          style={{
            fontFamily: fontDisplay,
            fontSize: 15,
            color: palette.ink,
            letterSpacing: "0.05em",
          }}
        >
          {name}
        </span>
      </div>
      <div style={{ display: "flex", gap: 8 }}>
        <a
          href={`tel:${phone}`}
          style={iconBtn}
          aria-label={`${name}에게 전화`}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
          </svg>
        </a>
        <a
          href={`sms:${phone}`}
          style={iconBtn}
          aria-label={`${name}에게 문자`}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
        </a>
      </div>
    </div>
  );
}

const iconBtn = {
  width: 32,
  height: 32,
  borderRadius: 999,
  border: `1px solid ${palette.rule}`,
  background: palette.paper,
  color: palette.accent,
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  textDecoration: "none",
};

/*
function People() {
  return (
    <section style={{ padding: "0 28px 48px" }}>
      <Reveal>
        <SectionTitle eyebrow="PEOPLE" title="신랑 · 신부" />

        <div
          style={{
            background: palette.paper,
            border: `1px solid ${palette.rule}`,
            padding: "20px 22px",
          }}
        >
          <ContactRow label="신랑" name={data.groom.name} phone={data.groom.phone} />
          <div style={{ height: 1, background: palette.rule }} />
          <ContactRow label="신부" name={data.bride.name} phone={data.bride.phone} />
        </div>
      </Reveal>
    </section>
  );
}
  */

const subhead = {
  fontFamily: fontBody,
  fontSize: 11,
  letterSpacing: "0.3em",
  color: palette.accent,
  marginBottom: 8,
  paddingBottom: 8,
  borderBottom: `1px solid ${palette.rule}`,
};

/* =========================================================================
   캘린더 (결혼식 날짜 표시)
   ========================================================================= */
function CalendarView() {
  const wedding = new Date(data.weddingDate);
  const year = wedding.getFullYear();
  const month = wedding.getMonth();
  const targetDay = wedding.getDate();
  const firstDay = new Date(year, month, 1).getDay();
  const lastDate = new Date(year, month + 1, 0).getDate();

  const cells = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= lastDate; d++) cells.push(d);
  while (cells.length % 7 !== 0) cells.push(null);

  const dayLabels = ["S", "M", "T", "W", "T", "F", "S"];
  const monthName = ["JAN","FEB","MAR","APR","MAY","JUN","JUL","AUG","SEP","OCT","NOV","DEC"][month];

  return (
    <section style={{ padding: "0 28px 48px" }}>
      <Reveal>
        <SectionTitle eyebrow="WHEN" title={data.weddingDateLabel} />

        <div
          style={{
            background: palette.paper,
            border: `1px solid ${palette.rule}`,
            padding: "24px 20px",
          }}
        >
          <div style={{ textAlign: "center", marginBottom: 18 }}>
            <div
              style={{
                fontFamily: fontDisplay,
                fontSize: 28,
                color: palette.ink,
                letterSpacing: "0.15em",
              }}
            >
              {monthName} {year}
            </div>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(7, 1fr)",
              gap: 4,
              fontFamily: fontBody,
              fontSize: 11,
            }}
          >
            {dayLabels.map((d, i) => (
              <div
                key={i}
                style={{
                  textAlign: "center",
                  padding: "4px 0",
                  color: i === 0 ? "#c08070" : i === 6 ? palette.sage : palette.inkSoft,
                  letterSpacing: "0.1em",
                }}
              >
                {d}
              </div>
            ))}
            {cells.map((d, i) => {
              const isWedding = d === targetDay;
              const dow = i % 7;
              return (
                <div
                  key={i}
                  style={{
                    aspectRatio: "1 / 1",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontFamily: fontDisplay,
                    fontSize: 13,
                    color: isWedding
                      ? "#fff"
                      : dow === 0
                      ? "#c08070"
                      : dow === 6
                      ? palette.sage
                      : palette.ink,
                    background: isWedding ? palette.accent : "transparent",
                    borderRadius: isWedding ? "50%" : 0,
                    position: "relative",
                  }}
                >
                  {d || ""}
                  {isWedding && (
                    <span
                      style={{
                        position: "absolute",
                        bottom: -2,
                        fontSize: 8,
                      }}
                    >
                      ♥
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </Reveal>
      <div style={{ marginTop: 24 }}>
        <Countdown />
      </div>
    </section>
  );
}

/* =========================================================================
   갤러리
   ========================================================================= */
function Gallery() {
  const [idx, setIdx] = useState(null);
  const open = idx !== null;

  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    startIndex: idx ?? 0,
  });
  const [selectedIndex, setSelectedIndex] = useState(0);

  // 라이트박스 열릴 때 클릭한 사진으로 점프
  useEffect(() => {
    if (open && emblaApi) {
      emblaApi.scrollTo(idx, true);
      setSelectedIndex(idx);
    }
  }, [open, emblaApi, idx]);

  // 캐러셀 슬라이드 변경 감지
  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => setSelectedIndex(emblaApi.selectedScrollSnap());
    emblaApi.on("select", onSelect);
    return () => emblaApi.off("select", onSelect);
  }, [emblaApi]);

  // 키보드 (← → ESC)
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === "Escape") setIdx(null);
      if (e.key === "ArrowLeft") emblaApi && emblaApi.scrollPrev();
      if (e.key === "ArrowRight") emblaApi && emblaApi.scrollNext();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, emblaApi]);

  const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);
  const scrollTo = useCallback((i) => emblaApi && emblaApi.scrollTo(i), [emblaApi]);

  return (
    <section style={{ padding: "0 28px 48px" }}>
      <Reveal>
        <SectionTitle eyebrow="GALLERY" title="우리의 순간" />
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 6,
          }}
        >
          {data.gallery.map((src, i) => (
            <PhotoPlaceholder
              key={i}
              src={src}
              onClick={() => setIdx(i)}
              aspect="1 / 1"
            />
          ))}
        </div>
      </Reveal>

      {open && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(20,16,12,0.94)",
            zIndex: 50,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: 20,
          }}
        >
          {/* 닫기 버튼 */}
          <button
            onClick={() => setIdx(null)}
            style={{
              position: "absolute",
              top: 16,
              right: 16,
              width: 40,
              height: 40,
              borderRadius: 999,
              border: "none",
              background: "rgba(255,255,255,0.1)",
              color: "#fff",
              fontSize: 20,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            aria-label="닫기"
          >
            ✕
          </button>

          {/* 캐러셀 */}
          <div style={{ width: "100%", maxWidth: 380, position: "relative" }}>
            <div ref={emblaRef} style={{ overflow: "hidden" }}>
              <div style={{ display: "flex" }}>
                {data.gallery.map((src, i) => (
                  <div
                    key={i}
                    style={{
                      flex: "0 0 100%",
                      minWidth: 0,
                      paddingRight: 0,
                    }}
                  >
                    <PhotoPlaceholder src={src} aspect="3 / 4" />
                  </div>
                ))}
              </div>
            </div>

            {/* 좌우 화살표 (모바일에서는 살짝 작게) */}
            <button
              onClick={scrollPrev}
              style={arrowBtn("left")}
              aria-label="이전 사진"
            >
              ‹
            </button>
            <button
              onClick={scrollNext}
              style={arrowBtn("right")}
              aria-label="다음 사진"
            >
              ›
            </button>
          </div>

          {/* 인디케이터 (점) */}
          <div
            style={{
              display: "flex",
              gap: 6,
              marginTop: 20,
              flexWrap: "wrap",
              justifyContent: "center",
              maxWidth: 280,
            }}
          >
            {data.gallery.map((_, i) => (
              <button
                key={i}
                onClick={() => scrollTo(i)}
                style={{
                  width: selectedIndex === i ? 18 : 6,
                  height: 6,
                  borderRadius: 999,
                  border: "none",
                  background: selectedIndex === i ? "#e8dfd0" : "rgba(255,255,255,0.3)",
                  cursor: "pointer",
                  transition: "all 200ms",
                  padding: 0,
                }}
                aria-label={`${i + 1}번 사진으로 이동`}
              />
            ))}
          </div>

          {/* 카운터 */}
          <div
            style={{
              color: "#e8dfd0",
              fontFamily: fontBody,
              fontSize: 11,
              letterSpacing: "0.3em",
              marginTop: 12,
            }}
          >
            {selectedIndex + 1} / {data.gallery.length}
          </div>
        </div>
      )}
    </section>
  );
}

const arrowBtn = (side) => ({
  position: "absolute",
  top: "50%",
  [side]: 8,
  transform: "translateY(-50%)",
  width: 36,
  height: 36,
  borderRadius: 999,
  border: "none",
  background: "rgba(0,0,0,0.4)",
  color: "#fff",
  fontSize: 24,
  lineHeight: 1,
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  paddingBottom: 4,
});

/* =========================================================================
   오시는 길
   ========================================================================= */
function Venue() {
  return (
    <section style={{ padding: "0 28px 48px" }}>
      <Reveal>
        <SectionTitle eyebrow="LOCATION" title="오시는 길" />

        {/* 약도 이미지 — 네이버/카카오 지도 버튼에서 길찾기로 연결됨 */}
        <a
          href={data.venue.naverMapUrl}
          target="_blank"
          rel="noreferrer"
          style={{
            display: "block",
            border: `1px solid ${palette.rule}`,
            background: palette.paper,
            overflow: "hidden",
          }}
          aria-label="네이버 지도에서 위치 보기"
        >
          <img
            src={MAP_IMAGE}
            alt="남산골한옥마을 약도"
            style={{ width: "100%", display: "block" }}
          />
        </a>

        <div style={{ textAlign: "center", marginTop: 24 }}>
          <div
            style={{
              fontFamily: fontDisplay,
              fontSize: 18,
              color: palette.ink,
              letterSpacing: "0.05em",
            }}
          >
            {data.venue.name}
          </div>
          <div
            style={{
              fontFamily: fontBody,
              fontSize: 12,
              color: palette.inkSoft,
              marginTop: 4,
            }}
          >
            {data.venue.hall}
          </div>
          <div
            style={{
              fontFamily: fontBody,
              fontSize: 13,
              color: palette.ink,
              marginTop: 12,
            }}
          >
            {data.venue.address}
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 8,
            marginTop: 20,
          }}
        >
          <a
            href={data.venue.naverMapUrl}
            target="_blank"
            rel="noreferrer"
            style={ctaBtn}
          >
            네이버 지도
          </a>
          <a
            href={data.venue.kakaoMapUrl}
            target="_blank"
            rel="noreferrer"
            style={ctaBtn}
          >
            카카오 지도
          </a>
        </div>

        <div style={{ marginTop: 28 }}>
          {data.venue.transit.map((t, i) => (
            <div
              key={i}
              style={{
                padding: "16px 0",
                borderTop: `1px solid ${palette.rule}`,
              }}
            >
              <div
                style={{
                  fontFamily: fontDisplay,
                  fontSize: 14,
                  color: palette.accent,
                  letterSpacing: "0.1em",
                  marginBottom: 8,
                }}
              >
                {t.title}
              </div>
              {t.lines.map((line, j) => (
                <div
                  key={j}
                  style={{
                    fontFamily: fontBody,
                    fontSize: 13,
                    color: palette.ink,
                    lineHeight: 1.8,
                  }}
                >
                  · {line}
                </div>
              ))}
            </div>
          ))}
        </div>
      </Reveal>
    </section>
  );
}

const ctaBtn = {
  display: "block",
  textAlign: "center",
  padding: "12px 0",
  background: palette.paper,
  border: `1px solid ${palette.accent}`,
  color: palette.accent,
  fontFamily: fontBody,
  fontSize: 12,
  letterSpacing: "0.2em",
  textDecoration: "none",
};

/* =========================================================================
   마음 전하실 곳 (계좌)
   ========================================================================= */
function AccountItem({ acc }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(acc.number).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      });
    }
  };
  return (
    <div
      style={{
        padding: "14px 16px",
        borderTop: `1px solid ${palette.rule}`,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        gap: 12,
      }}
    >
      <div>
        <div
          style={{
            fontFamily: fontBody,
            fontSize: 10,
            letterSpacing: "0.2em",
            color: palette.accent,
          }}
        >
          {acc.role.toUpperCase()}
        </div>
        <div
          style={{
            fontFamily: fontDisplay,
            fontSize: 13,
            color: palette.ink,
            marginTop: 4,
          }}
        >
          {acc.bank} · {acc.owner}
        </div>
        <div
          style={{
            fontFamily: fontBody,
            fontSize: 12,
            color: palette.inkSoft,
            marginTop: 2,
            letterSpacing: "0.05em",
          }}
        >
          {acc.number}
        </div>
      </div>
      <button
        onClick={handleCopy}
        style={{
          padding: "8px 12px",
          border: `1px solid ${palette.accent}`,
          background: copied ? palette.accent : "transparent",
          color: copied ? "#fff" : palette.accent,
          fontFamily: fontBody,
          fontSize: 11,
          letterSpacing: "0.15em",
          cursor: "pointer",
          whiteSpace: "nowrap",
          transition: "all 200ms",
        }}
      >
        {copied ? "복사됨" : "복사"}
      </button>
    </div>
  );
}

function Accounts() {
  const [side, setSide] = useState("groom");
  const list = side === "groom" ? data.accounts.groom : data.accounts.bride;

  return (
    <section style={{ padding: "0 28px 48px" }}>
      <Reveal>
        <SectionTitle eyebrow="GIFT" title="마음 전하실 곳" />
        <div
          style={{
            textAlign: "center",
            fontFamily: fontDisplay,
            fontSize: 13,
            color: palette.inkSoft,
            lineHeight: 2,
            marginBottom: 24,
          }}
        >
        
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            background: palette.paper,
            border: `1px solid ${palette.rule}`,
          }}
        >
          {["groom", "bride"].map((s) => (
            <button
              key={s}
              onClick={() => setSide(s)}
              style={{
                padding: "12px 0",
                background: side === s ? palette.accent : "transparent",
                color: side === s ? "#fff" : palette.inkSoft,
                border: "none",
                fontFamily: fontBody,
                fontSize: 12,
                letterSpacing: "0.2em",
                cursor: "pointer",
              }}
            >
              {s === "groom" ? "신랑 측" : "신부 측"}
            </button>
          ))}
        </div>

        <div
          style={{
            background: palette.paper,
            borderLeft: `1px solid ${palette.rule}`,
            borderRight: `1px solid ${palette.rule}`,
            borderBottom: `1px solid ${palette.rule}`,
          }}
        >
          {list.map((acc, i) => (
            <AccountItem key={i} acc={acc} />
          ))}
        </div>
      </Reveal>
    </section>
  );
}

/* =========================================================================
   방명록
   ========================================================================= */
function Guestbook() {
  const [name, setName] = useState("");
  const [msg, setMsg] = useState("");
  const [list, setList] = useState([
  ]);

  const submit = () => {
    if (!name.trim() || !msg.trim()) return;
    setList([{ name, msg, time: "방금 전" }, ...list]);
    setName("");
    setMsg("");
  };

  return (
    <section style={{ padding: "0 28px 48px" }}>
      <Reveal>
        <SectionTitle eyebrow="GUEST BOOK" title="축하 메시지" />

        <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 20 }}>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="이름"
            style={inputStyle}
          />
          <textarea
            value={msg}
            onChange={(e) => setMsg(e.target.value)}
            placeholder="축하의 메시지를 남겨주세요"
            rows={3}
            maxLength={200}
            style={{ ...inputStyle, resize: "none", fontFamily: fontBody }}
          />
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <span
              style={{
                fontFamily: fontBody,
                fontSize: 11,
                color: palette.inkSoft,
              }}
            >
              {msg.length}/200
            </span>
            <button
              onClick={submit}
              style={{
                padding: "10px 20px",
                background: palette.accent,
                color: "#fff",
                border: "none",
                fontFamily: fontBody,
                fontSize: 12,
                letterSpacing: "0.2em",
                cursor: "pointer",
              }}
            >
              메시지 남기기
            </button>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {list.map((entry, i) => (
            <div
              key={i}
              style={{
                background: palette.paper,
                border: `1px solid ${palette.rule}`,
                padding: "14px 16px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "baseline",
                  marginBottom: 6,
                }}
              >
                <span
                  style={{
                    fontFamily: fontDisplay,
                    fontSize: 13,
                    color: palette.ink,
                  }}
                >
                  {entry.name}
                </span>
                <span
                  style={{
                    fontFamily: fontBody,
                    fontSize: 10,
                    color: palette.inkSoft,
                  }}
                >
                  {entry.time}
                </span>
              </div>
              <div
                style={{
                  fontFamily: fontBody,
                  fontSize: 13,
                  color: palette.ink,
                  lineHeight: 1.6,
                }}
              >
                {entry.msg}
              </div>
            </div>
          ))}
        </div>
      </Reveal>
    </section>
  );
}

const inputStyle = {
  padding: "12px 14px",
  background: palette.paper,
  border: `1px solid ${palette.rule}`,
  fontFamily: fontBody,
  fontSize: 13,
  color: palette.ink,
  outline: "none",
};

/* =========================================================================
   공유하기
   ========================================================================= */
function Share() {
  const [copied, setCopied] = useState(false);
  const url = typeof window !== "undefined" ? window.location.href : "";

  const copyLink = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url || "청첩장 링크").then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      });
    }
  };

  const share = () => {
    if (navigator.share) {
      navigator
        .share({
          title: `${data.groom.name} ♥ ${data.bride.name} 결혼합니다`,
          text: `${data.weddingDateLabel} ${data.venue.name}`,
          url,
        })
        .catch(() => {});
    } else {
      copyLink();
    }
  };

  return (
    <section style={{ padding: "0 28px 48px" }}>
      <Reveal>
        <SectionTitle eyebrow="SHARE" title="청첩장 공유하기" />
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 8,
          }}
        >
          <button onClick={share} style={shareBtn}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
              <circle cx="18" cy="5" r="3" />
              <circle cx="6" cy="12" r="3" />
              <circle cx="18" cy="19" r="3" />
              <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
              <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
            </svg>
            공유하기
          </button>
          <button onClick={copyLink} style={shareBtn}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
              <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
              <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
            </svg>
            {copied ? "복사됨" : "링크 복사"}
          </button>
        </div>
      </Reveal>
    </section>
  );
}

const shareBtn = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  gap: 8,
  padding: "14px 0",
  background: palette.paper,
  border: `1px solid ${palette.accent}`,
  color: palette.accent,
  fontFamily: fontBody,
  fontSize: 12,
  letterSpacing: "0.2em",
  cursor: "pointer",
};

/* =========================================================================
   푸터
   ========================================================================= */
function Footer() {
  return (
    <footer
      style={{
        padding: "32px 24px 60px",
        textAlign: "center",
      }}
    >
      <div style={{ display: "flex", justifyContent: "center", marginBottom: 20 }}>
        <Botanical size={48} flip />
      </div>
      <div
        style={{
          fontFamily: fontDisplay,
          fontSize: 14,
          color: palette.ink,
          letterSpacing: "0.1em",
        }}
      >
        Thank you
      </div>
      <div
        style={{
          marginTop: 8,
          fontFamily: fontBody,
          fontSize: 11,
          color: palette.inkSoft,
          letterSpacing: "0.15em",
        }}
      >
        with love, {data.groom.name} & {data.bride.name}
      </div>
    </footer>
  );
}

function IntroOverlay() {
  const [visible, setVisible] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;

    document.body.style.overflow = "hidden";

    const fontLink = document.createElement("link");
    fontLink.rel = "stylesheet";
    fontLink.href =
      "https://fonts.googleapis.com/css2?family=Great+Vibes&display=swap";
    document.head.appendChild(fontLink);

    const fadeTimer = setTimeout(() => {
      setFadeOut(true);
    }, 3000);

    const removeTimer = setTimeout(() => {
      setVisible(false);
      document.body.style.overflow = "";

      setTimeout(() => {
        window.scrollTo(0, 0);
        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0;

        // 음악 시작 시도
        const audio = document.getElementById("wedding-bgm");
        if (audio) {
          audio.volume = 0;
audio.play()
  .then(() => {
    fadeInAudio(audio, 0.45, 1800);
  })
  .catch(() => {});
        }

        // 첫 화면 자연스럽게 등장
        const card = document.getElementById("wedding-card");
        if (card) {
          card.classList.add("wedding-card-enter");
        }
      }, 0);
    }, 3900);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(removeTimer);
      document.body.style.overflow = "";
      try {
        document.head.removeChild(fontLink);
      } catch (e) {}
    };
  }, []);

  if (!visible) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        background: fadeOut
          ? "rgba(20, 16, 12, 0)"
          : "rgba(20, 16, 12, 0.82)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        opacity: fadeOut ? 0 : 1,
        transition: "opacity 900ms ease, background 900ms ease",
        pointerEvents: "none",
      }}
    >
      <div className="intro-script">
        <div>We're</div>
        <div>getting</div>
        <div>married</div>
      </div>

      <style>{`
        .intro-script {
          font-family: 'Great Vibes', cursive;
          font-size: 56px;
          line-height: 1.05;
          color: #f7f3ec;
          text-align: center;
          white-space: nowrap;
          animation: introScale 2600ms ease forwards;
        }

        .intro-script div {
          opacity: 0;
          transform: translateY(18px);
          filter: blur(6px);
          animation: introLineReveal 1000ms ease forwards;
        }

        .intro-script div:nth-child(1) {
          animation-delay: 0ms;
        }

        .intro-script div:nth-child(2) {
          animation-delay: 380ms;
        }

        .intro-script div:nth-child(3) {
          animation-delay: 760ms;
        }

        @keyframes introLineReveal {
          0% {
            opacity: 0;
            transform: translateY(18px);
            filter: blur(6px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
            filter: blur(0);
          }
        }

        @keyframes introScale {
          0% {
            transform: scale(0.96);
          }
          100% {
            transform: scale(1);
          }
        }

        .wedding-card-enter {
          animation: weddingCardEnter 900ms ease forwards;
        }

        @keyframes weddingCardEnter {
          0% {
            opacity: 0.86;
            transform: translateY(18px) scale(0.985);
            filter: brightness(0.92);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
            filter: brightness(1);
          }
        }
      `}</style>
    </div>
  );
}




/* =========================================================================
   루트
   ========================================================================= */
export default function WeddingInvitation() {
  // Google Fonts 동적 로딩
  useEffect(() => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href =
      "https://fonts.googleapis.com/css2?family=Noto+Serif+KR:wght@300;400;500&family=Noto+Sans+KR:wght@300;400;500&display=swap";
    document.head.appendChild(link);
    return () => {
      try { document.head.removeChild(link); } catch (e) {}
    };
  }, []);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#2a2622",
        padding: "0",
        fontFamily: fontBody,
      }}
    >
      <IntroOverlay />

      <div
        id="wedding-card"
        style={{
          maxWidth: 420,
          margin: "0 auto",
          background: palette.bg,
          color: palette.ink,
          boxShadow: "0 40px 80px -20px rgba(0,0,0,0.4)",
          overflow: "hidden",
        }}
      ></div>


      <div
        style={{
          maxWidth: 420,
          margin: "0 auto",
          background: palette.bg,
          color: palette.ink,
          boxShadow: "0 40px 80px -20px rgba(0,0,0,0.4)",
          overflow: "hidden",
        }}
      >
        <Cover />
        <Greeting />
        {/* <People /> */}
        <CalendarView />
        <Gallery />
        <Venue />
        <Accounts />

        <Share />
        <Footer />
      </div>
    </div>
  );
}


// <Guestbook />