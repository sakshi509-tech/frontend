import { useEffect, useState } from "react";
import axios from "axios";
import { Link, useParams } from "react-router-dom";
import Navbar from "../component/navbar";


function CategoryProducts() {


  const { id } = useParams();


  const [products, setProducts] = useState([]);

  const [category, setCategory] = useState(null);

  const [loading, setLoading] = useState(true);




  useEffect(() => {

    getData();

  }, [id]);




  const getData = async () => {

    try {

      setLoading(true);


      // Category Details
      const categoryRes = await axios.get(
        `https://e-comm-4-39jg.onrender.com/api/category/single/${id}`
      );

      if (categoryRes.data.success) {
        setCategory(categoryRes.data.category);
      }


      // Category Products
      const { data } = await axios.get(
        `https://e-comm-4-39jg.onrender.com/api/product/all?category=${id}`
      );

      if (data.success) {
        setProducts(data.products);
      }


    } catch (error) {

      console.log(error);

    } finally {

      setLoading(false);

    }

  };




  if (loading) {

    return (

      <>
        <Navbar />

        <div className="h-screen flex justify-center items-center">

          <h1 className="text-3xl font-bold text-green-600">
            Loading Products...
          </h1>

        </div>
      </>

    );

  }




  return (

    <>

      <Navbar />


      <div className="min-h-screen bg-gray-100 py-10 px-5">


        <div className="max-w-7xl mx-auto">


          {/* Heading */}

          <h1 className="text-4xl font-bold text-center mb-3 text-green-600">

            {category?.name || "Category"}

          </h1>


          <p className="text-center text-gray-500 mb-10">

            {products.length} Products Found

          </p>




          {/* Products */}

          {
            products.length === 0 ?

            (

              <div className="flex justify-center items-center h-96">

                <h2 className="text-2xl font-bold text-gray-500">
                  No Products In This Category
                </h2>

              </div>

            )

            :

            (

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">


                {
                  products.map((product) => (


                    <Link

                      key={product._id}

                      to={`/product/${product._id}`}

                      className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-2xl transition duration-300"

                    >


                      <img

                        src={product.image?.[0]}

                        alt={product.name}

                        className="w-full h-56 object-cover hover:scale-105 transition duration-300"

                      />



                      <div className="p-5">


                        <h2 className="text-xl font-bold hover:text-green-600 transition">
                          {product.name}
                        </h2>


                        <p className="text-gray-500 text-sm mt-2">
                          {product.description?.slice(0, 60)}...
                        </p>



                        {/* Price */}

                        <div className="flex items-center gap-2 mt-4">

                          {
                            product.discountPrice ?

                            (
                              <>
                                <span className="text-green-600 text-xl font-bold">
                                  ₹{product.price - product.discountPrice}
                                </span>

                                <span className="line-through text-gray-400">
                                  ₹{product.price}
                                </span>
                              </>
                            )

                            :

                            (
                              <span className="text-xl font-bold text-green-600">
                                ₹{product.price}
                              </span>
                            )
                          }

                        </div>



                        {/* Stock */}

                        <div className="mt-3">

                          {
                            product.stock > 0 ?

                            (
                              <span className="text-green-600 font-semibold">
                                {product.stock} In Stock
                              </span>
                            )

                            :

                            (
                              <span className="text-red-500 font-semibold">
                                Out Of Stock
                              </span>
                            )
                          }

                        </div>


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


export default CategoryProducts;
