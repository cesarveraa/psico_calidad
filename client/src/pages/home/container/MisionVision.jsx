import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getSingleHomePage } from '../../../services/index/homePages';
import ResponsiveFlipCard from './responsiveFlipCard';
import SmallFlipCard from './smallFlipCard';
import ErrorMessage from '../../../components/ErrorMessage';
import ResponsiveFlipCardSkeleton from '../../../components/ResponsiveFlipCardSkeleton';
import SmallFlipCardSkeleton from '../../../components/SmallFlipCardSkeleton';

function MisionVision() {
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const slug = "home";

  const { data, isLoading, isError } = useQuery(["home", slug], () => getSingleHomePage(slug));

  useEffect(() => {
    const images = [
      "/images/homepage/mf.png",
      "/images/homepage/mb.png"
    ];

    let loadedImagesCount = 0;

    images.forEach((src) => {
      const img = new Image();
      img.src = src;
      img.onload = () => {
        loadedImagesCount++;
        if (loadedImagesCount === images.length) {
          setImagesLoaded(true);
        }
      };
    });
  }, []);

  if (isLoading || !imagesLoaded) return (
    <div className="container-visionmision">
      <div className="responsive-flipcardMision">
        <ResponsiveFlipCardSkeleton />
      </div>
      <div className="responsive-flipcardMision">
        <ResponsiveFlipCardSkeleton />
      </div>
      <div className="small-flipcardMision">
        <SmallFlipCardSkeleton />
      </div>
      <div className="small-flipcardMision">
        <SmallFlipCardSkeleton />
      </div>
    </div>
  );

  if (isError) return <ErrorMessage message="No se pudieron obtener los detalles de la página de inicio" />;

  const { mision, vision } = data.home;

  const visionContent = (
    <div>
      <h2>Visión</h2>
      <p>{vision}</p>
    </div>
  );

  const misionContent = (
    <div>
      <h2>Misión</h2>
      <p>{mision}</p>
    </div>
  );

  return (
    <div className="container-visionmision">
      <div className="responsive-flipcardMision">
        <ResponsiveFlipCard frontImage="/images/homepage/mf.png" backContent={misionContent} />
      </div>
      <div className="responsive-flipcardMision">
        <ResponsiveFlipCard frontImage="/images/homepage/mb.png" backContent={visionContent} />
      </div>
      <div className="small-flipcardMision">
        <SmallFlipCard frontImage="/images/homepage/mf.png" backContent={misionContent} />
      </div>
      <div className="small-flipcardMision">
        <SmallFlipCard frontImage="/images/homepage/mb.png" backContent={visionContent} />
      </div>
    </div>
  );
}

export default MisionVision;