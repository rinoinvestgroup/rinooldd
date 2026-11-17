import type { GetServerSideProps, NextPage } from 'next';

const ArgentinaRedirectPage: NextPage = () => null;

export const getServerSideProps: GetServerSideProps = async () => {
  return {
    redirect: {
      destination: '/properties/international',
      permanent: true,
    },
  };
};

export default ArgentinaRedirectPage;
