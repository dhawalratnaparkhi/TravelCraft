import React, { useState } from "react";
import "./Testimonials.css";
import { Star, X } from "lucide-react";

export default function Testimonials() {
  const [activeVideo, setActiveVideo] = useState(null);

  const testimonials = [
    {
      name: "Sowmitras",
      role: "Tech Lead",
      text:
        "Everything was extremely smooth. Planning, hotels, transport — no stress.",
      image: "https://randomuser.me/api/portraits/men/32.jpg",
      video: null
    },
    {
      name: "Dummy Mountain",
      role: "CEO",
      text:
        "This felt premium and personal. Not a generic tour experience.",
      image: "https://randomuser.me/api/portraits/men/45.jpg",
      video: null
    },
    {
      name: "Rizzo",
      role: "CEO",
      text:
        "I loved the experience so much that I recorded a short video review.",
      image: "https://randomuser.me/api/portraits/men/65.jpg",
      video: "dQw4w9WgXcQ"
    }
  ];

  return (
    <>
      <section className="testimonials-section">
        <div className="testimonials-container">
          <h2>What Our Travelers Say</h2>
          <p className="subtitle">
            Real experiences from people who trusted us
          </p>

          <div className="testimonials-grid">
            {testimonials.map((t, i) => (
              <div
                key={i}
                className={`testimonial-card ${
                  t.video ? "has-video" : ""
                }`}
              >
                {/* Video preview only if exists */}
                {t.video && (
                  <div
                    className="video-preview"
                    onClick={() => setActiveVideo(t.video)}
                  >
                    <img
                      src={`https://img.youtube.com/vi/${t.video}/hqdefault.jpg`}
                      alt="Video review"
                    />
                    <span className="play-btn">▶</span>
                  </div>
                )}

                <div className="stars">
                  {[...Array(5)].map((_, idx) => (
                    <Star key={idx} />
                  ))}
                </div>

                <p className="testimonial-text">“{t.text}”</p>

                <div className="testimonial-footer">
                  <div className="user">
                    <img src={t.image} alt={t.name} />
                    <div>
                      <strong>{t.name}</strong>
                      <span>{t.role}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* VIDEO MODAL */}
     {activeVideo && (
  <div
    className="video-modal"
    onClick={() => setActiveVideo(null)}
  >
    <div
      className="video-modal-content"
      onClick={(e) => e.stopPropagation()}
    >
      <button
        className="close-btn"
        onClick={() => setActiveVideo(null)}
      >
        ✕
      </button>

      <iframe
        src={`https://www.youtube.com/embed/${activeVideo}?autoplay=1`}
        title="Video Review"
        frameBorder="0"
        allow="autoplay; encrypted-media"
        allowFullScreen
      />
    </div>
  </div>
)}
    </>
  );
}
