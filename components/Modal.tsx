import {
  CheckIcon,
  PauseIcon,
  PlusIcon,
  ThumbUpIcon,
  VolumeOffIcon,
  VolumeUpIcon,
  XIcon
} from "@heroicons/react/outline";
import MuiModal from "@mui/material/Modal";
import { useRecoilState } from "recoil";
import { modalState, movieState } from "../atoms/modalAtom";
import { useEffect, useState } from "react";
import { Element, Genre, Movie } from "../typings";
import ReactPlayer from "react-player/lazy";
import { FaPlay } from "react-icons/fa";
import {
  DocumentData,
  collection,
  deleteDoc,
  doc,
//   getDoc,
  onSnapshot,
  setDoc
} from "firebase/firestore";
import useAuth from "../hooks/useAuth";
import { db } from "../lib/firebase";
import toast, { Toaster } from "react-hot-toast";
function Modal() {
  const [showModal, setShowModal] = useRecoilState(modalState);
  const [movie, setMovie] = useRecoilState(movieState);
  const [trailer, setTrailer] = useState("");
  const [playing, setPlaying] = useState(true);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [muted, setMuted] = useState(true);
  const [addedToList, setAddedToList] = useState(false);
  const { user } = useAuth();
  const [movies, setMovies] = useState<DocumentData[] | Movie[]>([]);

  const toastStyle = {
    background: "white",
    color: "black",
    fontWeight: "bold",
    fontSize: "16px",
    padding: "15px",
    borderRadius: "9999px",
    maxWidth: "1000px"
  };
  useEffect(() => {
    if (!movie) return;
    const fetchData = async () => {
      const data = await fetch(
        `https://api.themoviedb.org/3/${
          movie?.media_type === "tv" ? "tv" : "movie"
        }/${movie?.id}?api_key=${
          process.env.NEXT_PUBLIC_API_KEY
        }&language=en-US&append_to_response=videos`
      ).then((response) => response.json());

      if (data?.videos) {
        const index = data.videos.results.findIndex(
          (element: Element) => element.type === "Trailer"
        );
        setTrailer(data.videos.results[index]?.key);
      }
      if (data?.genres) {
        setGenres(data.genres);
      }
    };
    fetchData();
  }, [movie]);
  useEffect(() => {
    document.body.classList.add("overflowHidden");
    return () => {
      document.body.classList.remove("overflowHidden");
    };
  });
  const handleClose = () => {
    setShowModal(false);
    setMovie(null);
    toast.dismiss();
  };
  // Find all the movies in the user's list
  useEffect(() => {
    if (user) {
      return onSnapshot(
        collection(db, "customers", user.uid, "myList"),
        (snapshot) => setMovies(snapshot.docs)
      );
    }
  }, [db, movie?.id]);

  // Check if the movie is already in the user's list
  useEffect(
    () =>
      setAddedToList(
        movies.findIndex((result) => result.data().id === movie?.id) !== -1
      ),
    [movies]
  );

//   const handleLikedMovie = async () => {
//     const documentRef = doc(
//       db,
//       "customers",
//       user!.uid,
//       "myList",
//       movie?.id.toString()
//     );
//     const document = await getDoc(documentRef);
//     if (!document.exists()) {
//       let newMovie = structuredClone(movie);
//       newMovie!.liked = true;
//       await setDoc(
//         doc(db, "customers", user!.uid, "liked", movie?.id.toString()),
//         { ...newMovie }
//       );
//       toast(
//         `${
//           movie?.name || movie?.original_name || movie?.original_title
//         } has been adder to Liked List`,
//         {
//           duration: 8000,
//           style: toastStyle
//         }
//       );
//     }
//         await updateDoc(document, {
//           liked: true
//       });
//   };
  const handleList = async () => {
    if (addedToList) {
      await deleteDoc(
        doc(db, "customers", user!.uid, "myList", movie?.id.toString())
      );

      toast(
        `${
          movie?.name || movie?.original_name || movie?.original_title
        } has been removed from My List`,
        {
          duration: 8000,
          style: toastStyle
        }
      );
      return;
    }
    await setDoc(
      doc(db, "customers", user!.uid, "myList", movie?.id.toString()),
      { ...movie }
    );
    toast(
      `${
        movie?.name || movie?.original_name || movie?.original_title
      } has been added to My List`,
      {
        duration: 8000,
        style: toastStyle
      }
    );
  };

  return (
    <MuiModal
      open={showModal}
      onClose={handleClose}
      className="fixed !top-7 left-0 z-50 mx-auto w-full max-w-5xl overflow-hidden overflow-y-scroll rounded-md scrollbar-hide animate-fade"
    >
      <>
        <Toaster position="bottom-center" />
        <button
          className="modalButton absolute right-5 top-5 !z-40 h-9 w-9 border-none bg-[#181818] hover:bg-[#181818]"
          onClick={handleClose}
        >
          <XIcon className="h-6 w-6" />
        </button>

        <div className="relative pt-[56.25%]">
          <ReactPlayer
            url={`https://www.youtube.com/watch?v=${trailer}`}
            width="100%"
            height="100%"
            style={{ position: "absolute", top: "0", left: "0" }}
            playing={playing}
            muted={muted}
            onPlay={() => setPlaying(true)}
            onPause={() => setPlaying(false)}
            onEnded={() => setPlaying(false)}
          />
          <div className="absolute bottom-10 flex w-full items-center justify-between px-10">
            <div className="flex space-x-3">
              <button
                onClick={() => setPlaying(!playing)}
                className="flex items-center gap-x-2 rounded bg-white px-8 text-xl font-bold text-black transition hover:bg-[#e6e6e6]"
              >
                {!playing ? (
                  <FaPlay className="h-7 w-7 text-black" />
                ) : (
                  <PauseIcon className="h-7 w-7 " />
                )}
                {!playing ? "Play" : "Pause"}
              </button>
              <button className="modalButton" onClick={handleList}>
                {addedToList ? (
                  <CheckIcon className="h-7 w-7" />
                ) : (
                  <PlusIcon className="h-7 w-7" />
                )}
              </button>

              <button className="modalButton">
                <ThumbUpIcon className="h-7 w-7" />
              </button>
            </div>

            <button className="modalButton" onClick={() => setMuted(!muted)}>
              {muted ? (
                <VolumeOffIcon className="h-6 w-6" />
              ) : (
                <VolumeUpIcon className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        <div className="flex space-x-16 rounded-b-md bg-[#181818] px-10 py-8 transition ease-out">
          <div className="space-y-6 text-lg">
            <div className="flex items-center space-x-2 text-sm">
              <p className="font-semibold text-green-400">
                {movie!.vote_average * 10}% Match
              </p>
              <p className="font-light">
                {movie?.release_date || movie?.first_air_date}
              </p>
              <div className="flex h-4 items-center justify-center rounded border-white/40 px-1.5 text-xs">
                HD
              </div>
            </div>
            <div className="flex flex-col gap-x-10 gap-y-4 font-light md:flex-row">
              <p className="w-5/6">{movie?.overview}</p>
              <div className="flex flex-col space-y-3 text-sm">
                <div>
                  <span className="text-[gray]">Genres: </span>
                  {genres.map((genre) => genre.name).join(", ")}
                </div>
                <div>
                  <span className="text-[gray]">Original Language: </span>
                  {movie?.original_language}
                </div>
                <div>
                  <span className="text-[gray]">Vote Count: </span>
                  {movie?.vote_count}
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    </MuiModal>
  );
}

export default Modal;
