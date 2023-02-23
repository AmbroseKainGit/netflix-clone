import Head from "next/head";
import Banner from "../components/Banner";
import Header from "../components/Header";
import Category from "../components/Category";
import { Movie } from "../typings";
import requests from "../utils/request";
import useAuth from "../hooks/useAuth";
import { useRecoilValue } from "recoil";
import { modalState, movieState } from "../atoms/modalAtom";
import Modal from "../components/Modal";
import Plans from "../components/Plans";
import { Product, getProducts } from "@stripe/firestore-stripe-payments";
import payments from "../lib/stripe";
import useSubscription from "../hooks/useSubscription";
import useList from "../hooks/useList";

interface Props {
  netflixOriginals: Movie[];
  trendingNow: Movie[];
  topRated: Movie[];
  actionMovies: Movie[];
  comedyMovies: Movie[];
  horrorMovies: Movie[];
  romanceMovies: Movie[];
  documentaries: Movie[];
  products: Product[];
}

const Home = ({
  netflixOriginals,
  actionMovies,
  comedyMovies,
  documentaries,
  horrorMovies,
  romanceMovies,
  topRated,
  trendingNow,
  products
}: Props) => {
  const { loading, user } = useAuth();
  const showModal = useRecoilValue(modalState);
  const subscription = useSubscription(user);
  const movie = useRecoilValue(movieState);
  const userList = useList(user?.uid);
  if (loading || subscription === null) return null;
  if (!subscription) return <Plans products={products} />;
  return (
    <div className={`relative h-screen bg-gradient-to-b lg:h-[140vh]`}>
      <Head>
        <title>Home - Netflix</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header />
      <main className="relative pl-6 pb-24 lg:space-y-16 lg:pl-16">
        <Banner netflixOriginals={netflixOriginals} />
        <section className="md:space-y-24">
          <Category title="Trending Now" movies={trendingNow} />
          <Category title="Top Rated" movies={topRated} />
          <Category title="Action Thrillers" movies={actionMovies} />
          {userList.length > 0 && (
            <Category title="My List" movies={userList} />
          )}

          <Category title="Comedies" movies={comedyMovies} />
          <Category title="Scary Movies" movies={horrorMovies} />
          <Category title="Romance Movies" movies={romanceMovies} />
          <Category title="Documentaries" movies={documentaries} />
        </section>
      </main>
      {showModal && <Modal />}
    </div>
  );
};

export default Home;

export const getServerSideProps = async () => {
  const products = await getProducts(payments, {
    includePrices: true,
    activeOnly: true
  })
    .then((res) => res)
    .catch((err) => console.error(err));
  const [
    netflixOriginals,
    trendingNow,
    topRated,
    actionMovies,
    comedyMovies,
    horrorMovies,
    romanceMovies,
    documentaries
  ] = await Promise.all([
    fetch(requests.fetchNetflixOriginals).then((res) => res.json()),
    fetch(requests.fetchTrending).then((res) => res.json()),
    fetch(requests.fetchTopRated).then((res) => res.json()),
    fetch(requests.fetchActionMovies).then((res) => res.json()),
    fetch(requests.fetchComedyMovies).then((res) => res.json()),
    fetch(requests.fetchHorrorMovies).then((res) => res.json()),
    fetch(requests.fetchRomanceMovies).then((res) => res.json()),
    fetch(requests.fetchDocumentaries).then((res) => res.json())
  ]);

  return {
    props: {
      netflixOriginals: netflixOriginals.results,
      trendingNow: trendingNow.results,
      topRated: topRated.results,
      actionMovies: actionMovies.results,
      comedyMovies: comedyMovies.results,
      horrorMovies: horrorMovies.results,
      romanceMovies: romanceMovies.results,
      documentaries: documentaries.results,
      products: products
    }
  };
};
