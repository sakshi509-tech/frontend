import { useEffect, useState } from "react";
import axios from "axios";
import { useSearchParams, useNavigate } from "react-router-dom";
import Navbar from "../component/navbar";


function Search() {


  const navigate = useNavigate();


  const [products, setProducts] = useState([]);

  const [loading, setLoading] = useState(true);


  const [searchParams] = useSearchParams();


  const keyword = searchParams.get("keyword");






  useEffect(() => {


    getProducts();


  }, [keyword]);








  const getProducts = async () => {


    try {



      const { data } = await axios.get(


        `https://e-comm-4-39jg.onrender.com/api/product/all?keyword=${encodeURIComponent(keyword)}`


      );






      if (data.success) {

        setProducts(data.products);
      }

    }
    catch(error) {
      console.log(error);
    }
    finally {
      setLoading(false);
    }
  };

  if(loading){
    return(
      <>
        <Navbar />
        <div className="h-screen flex justify-center items-center">
          <h1 className="text-3xl font-bold">
            Loading...
          </h1>
    </div>
  </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="max-w-7xl mx-auto px-5 py-10">
        <h1 className="text-3xl font-bold mb-8">
          Search Result :
          <span className="text-green-600 ml-2">
            {keyword}
          </span>
        </h1>
        {
          products.length === 0 ?
          (
            <div className="text-center text-xl font-semibold">
              No Product Found
            </div>
          ):(
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {
                products.map((item)=>(
                  <div
                    key={item._id}
                    className="bg-white shadow-lg rounded-xl p-5 hover:shadow-xl transition"
                  >
                    <img src={item.image?.[0] || item.image } alt={item.name} className="h-48 w-full object-cover rounded-lg" />
<h2 className="text-xl font-bold mt-4">
 {item.name}
 </h2>
  <p className="text-green-600 font-bold mt-2">
  ₹ {item.price}
</p>
 <button
 onClick={() => navigate(`/product/${item._id}`)}
 className="mt-4 w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg" >
 View Details
</button>
 </div>
 ))
 }

</div>

 )
 }
 </div>

    </>
  );
}


export default Search;