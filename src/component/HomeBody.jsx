import React from 'react';
import styles from './HomeBody.module.css';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/autoplay'; // opcional

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
  return (
    <div className={styles.main}>
      <Carrossel />
      <p className={styles.introText}>Transforme sua garagem em um evento incrível — descubra, participe ou anuncie agora!</p>
    </div>
  );
}
