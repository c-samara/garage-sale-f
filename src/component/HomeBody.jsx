import React, { useEffect, useState } from 'react';
import styles from './HomeBody.module.css';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/autoplay';

function Carrossel() {
  const slides = [
    {
      imagem: '/img/foto_1.jpg',
      titulo: 'Descubra eventos perto de você',
      subtitulo: 'Saiba o que está acontecendo na sua região'
    },
    {
      imagem: '/img/foto_2.jpg',
      titulo: 'Alugue seu espaço',
      subtitulo: 'Cadastre sua propriedade para começar agora mesmo'
    },
    {
      imagem: '/img/foto_3.jpg',
      titulo: 'Promova seu evento',
      subtitulo: 'Nós te ajudamos com isso'
    }
  ];

  return (
    <Swiper
      modules={[Navigation, Pagination, Autoplay]}
      spaceBetween={20}
      slidesPerView={1}
      loop
      navigation
      pagination={{ clickable: true }}
      autoplay={{ delay: 5000, disableOnInteraction: false }}
    >
      {slides.map((slide, index) => (
        <SwiperSlide key={index}>
          <div className={styles.slideContainer}>
            <img
              className={styles.carouselImage}
              src={slide.imagem}
              alt={`Slide ${index + 1}`}
            />
            <div className={styles.imageOverlay}></div>
            <div className={styles.slideText}>
              <h2 className={styles.title}>{slide.titulo}</h2>
              <p className={styles.subtitle}>{slide.subtitulo}</p>
            </div>
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
}

export default function HomeBody() {
  const [eventos, setEventos] = useState([]);
  const [showHelpPrompt, setShowHelpPrompt] = useState(false);

  useEffect(() => {
    async function fetchEventos() {
      try {
        const res = await fetch('https://apex.oracle.com/pls/apex/garage_sale/api/events/');
        if (!res.ok) throw new Error('Erro ao carregar eventos');
        const data = await res.json();
        setEventos(data.items.slice(-4).reverse());
      } catch (err) {
        console.error(err);
      }
    }
    fetchEventos();
  }, []);

  useEffect(() => {
    let timeout = setTimeout(() => setShowHelpPrompt(true), 5000);
    const resetTimer = () => {
      clearTimeout(timeout);
      setShowHelpPrompt(false);
      timeout = setTimeout(() => setShowHelpPrompt(true), 5000);
    };

    window.addEventListener('mousemove', resetTimer);
    window.addEventListener('keydown', resetTimer);

    return () => {
      clearTimeout(timeout);
      window.removeEventListener('mousemove', resetTimer);
      window.removeEventListener('keydown', resetTimer);
    };
  }, []);

  return (
    <div className={styles.main}>
      <Carrossel />
     

      <section className={styles.latestEvents}>
        <h2>🕵️ Destaques na sua região</h2>
        <div className={styles.eventGrid}>
          {eventos.map((evento, index) => (
            <div key={evento.id} className={styles.eventCard}>
              {index === 0 && (
                <div className={styles.oportunidadeBadge}>Boa oportunidade</div>
              )}
              <h3>{evento.name}</h3>
              <p><strong>Data:</strong> {evento.event_date}</p>
              <p><strong>Horário:</strong> {evento.begins_at} - {evento.finishes_at}</p>
              <p><strong>Tipo:</strong> {evento.event_type}</p>
              <p><strong>Categoria:</strong> {evento.product_category}</p>
            </div>
          ))}
        </div>
      </section>

      <div className={styles.chatBubbleIcon}>
        💬
        {showHelpPrompt && <span className={styles.helpPrompt}>Precisa de ajuda?</span>}
      </div>
    </div>
  );
}
