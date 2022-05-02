import React from 'react';
import poster from '../../img/poster.png';

const HomePage = () => {
  return (
    <>
      <section className='pb-10 bg-gray-800'>
        <div className='relative container px-4 mx-auto'>
          <div className='flex flex-wrap items-center -mx-4 mb-10 2xl:mb-14'>
            <div className='w-full lg:w-1/2 px-10 mb-16 lg:mb-16'>
              <span className='text-lg font-bold text-blue-400'>
                Create posts to educate
              </span>
              <h2 className='max-w-2xl mt-12 mb-12 text-6xl 2xl:text-7xl text-white font-bold font-heading'>
                Pen down your ideas
                <span className='text-yellow-500'> By creating a post</span>
              </h2>
              <p className='mb-12 lg:mb-16 2xl:mb-24 text-xl text-gray-100'>
                Your post must be free from racism and unhealthy words
              </p>
              <a
                className='inline-block px-12 py-5 mb-16 text-lg text-white font-bold bg-blue-500 hover:bg-blue-600 rounded-full transition duration-200'
                href='/'
              >
                Join Community
              </a>
            </div>
            <div className='w-full lg:w-1/2 pr-16'>
              <img className='w-full' src={poster} alt={poster} />
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default HomePage;
