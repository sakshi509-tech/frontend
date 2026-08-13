import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { FaArrowRight } from "react-icons/fa";


function Category() {

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);



  const getCategories = async () => {

    try {

      const { data } = await axios.get(
        "https://e-comm-4-39jg.onrender.com/api/category/all"
      );


      if(data.success){

        setCategories(data.categories);

      }


    } catch(error){

      console.log(error);

    }
    finally{

      setLoading(false);

    }

  };




  useEffect(()=>{

    getCategories();

  },[]);





  if(loading){

    return(

      <div className="
      h-screen
      flex
      justify-center
      items-center
      text-2xl
      font-bold
      text-green-600
      ">

        Loading Categories...

      </div>

    )

  }





  return (

    <>


    <div className="
    min-h-screen
    bg-gradient-to-br
    from-green-50
    via-white
    to-green-100
    py-12
    ">



      <div className="
      max-w-7xl
      mx-auto
      px-5
      ">



        {/* Heading */}

        <div className="text-center mb-12">


          <h1 className="
          text-4xl
          md:text-5xl
          font-extrabold
          text-green-600
          ">

            Explore Categories

          </h1>


          <p className="
          text-gray-500
          mt-3
          text-lg
          ">

            Find your favourite products from different categories

          </p>


        </div>





        {
          categories.length === 0 ?


          (

            <div className="
            bg-white
            shadow
            rounded-xl
            p-10
            text-center
            text-gray-500
            ">

              No Category Found

            </div>

          )


          :



          (

          <div className="
          grid
          grid-cols-1
          sm:grid-cols-2
          md:grid-cols-3
          lg:grid-cols-4
          gap-8
          ">


          {
            categories.map((category)=>(


              <Link

              key={category._id}

              to={`/category/${category._id}`}

              className="
              group
              bg-white
              rounded-2xl
              overflow-hidden
              shadow-md
              hover:shadow-2xl
              transition
              duration-300
              ">


                {/* Image */}


                <div className="
                relative
                overflow-hidden
                ">


                  <img

                  src={category.image}

                  alt={category.name}

                  className="
                  w-full
                  h-56
                  object-cover
                  group-hover:scale-110
                  transition
                  duration-500
                  "


                  />



                  <div className="
                  absolute
                  inset-0
                  bg-black/20
                  group-hover:bg-black/40
                  transition
                  ">

                  </div>



                </div>





                {/* Content */}


                <div className="
                p-6
                ">



                  <h2 className="
                  text-xl
                  font-bold
                  text-gray-800
                  group-hover:text-green-600
                  transition
                  ">

                    {category.name}

                  </h2>





                  <p className="
                  text-gray-500
                  text-sm
                  mt-2
                  line-clamp-2
                  ">

                    {category.discription || category.description}

                  </p>



                </div>





              </Link>


            ))
          }



          </div>

          )

        }



      </div>



    </div>



    </>

  );

}


export default Category;