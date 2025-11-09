import{r as t,j as e,B as f,L as j,s as y}from"./index-s1Im0gGd.js";import{T as b}from"./TripCard-DomRgofk.js";import{I as x}from"./Input-BKp795_O.js";import{S as N}from"./search-DZtwayj2.js";import{S as _}from"./server-crash-DZrP2UOO.js";import"./map-pin-CGMQsRrg.js";import"./calendar-8PhAnDAA.js";import"./weight-h7E0NLn2.js";function z(){const[l,u]=t.useState([]),[i,c]=t.useState(!0),[o,n]=t.useState(""),[a,p]=t.useState(""),[s,h]=t.useState(""),d=async()=>{try{c(!0),n("");let r=y.from("trips").select(`
          id,
          title,
          departure_city,
          arrival_city,
          departure_date,
          arrival_date,
          available_weight,
          price_per_kg,
          currency,
          traveler:users!traveler_id (
            first_name,
            last_name,
            profile_picture
          )
        `).eq("status","AVAILABLE").order("departure_date",{ascending:!0});a&&(r=r.ilike("departure_city",`%${a}%`)),s&&(r=r.ilike("arrival_city",`%${s}%`));const{data:v,error:m}=await r;if(m)throw m;u(v||[])}catch(r){n("Erreur lors du chargement des voyages."),console.error("Error fetching trips:",r)}finally{c(!1)}};t.useEffect(()=>{d()},[]);const g=r=>{r.preventDefault(),d()};return e.jsx("div",{className:"min-h-screen bg-neutral-50 py-12 px-4 sm:px-6 lg:px-8",children:e.jsxs("div",{className:"max-w-7xl mx-auto",children:[e.jsxs("div",{className:"text-center mb-12",children:[e.jsx("h1",{className:"text-4xl md:text-5xl font-bold text-neutral-800 mb-4",children:"Trouver un voyage"}),e.jsx("p",{className:"text-xl text-neutral-600 max-w-3xl mx-auto",children:"Parcourez les trajets disponibles et trouvez le voyageur parfait pour votre colis."})]}),e.jsx("div",{className:"bg-white rounded-4xl shadow-lg p-6 mb-12 max-w-4xl mx-auto",children:e.jsxs("form",{onSubmit:g,className:"grid sm:grid-cols-3 gap-4 items-end",children:[e.jsx(x,{label:"Ville de départ",value:a,onChange:r=>p(r.target.value),placeholder:"Ex: Dakar"}),e.jsx(x,{label:"Ville d'arrivée",value:s,onChange:r=>h(r.target.value),placeholder:"Ex: Abidjan"}),e.jsxs(f,{type:"submit",className:"w-full h-12 text-base bg-primary hover:bg-primary/90 text-white",loading:i,children:[e.jsx(N,{className:"w-5 h-5 mr-2"}),"Rechercher"]})]})}),i?e.jsx("div",{className:"flex justify-center items-center py-20",children:e.jsx(j,{className:"w-12 h-12 text-primary animate-spin"})}):o?e.jsxs("div",{className:"text-center py-20 bg-red-50 rounded-2xl",children:[e.jsx(_,{className:"w-12 h-12 text-red-500 mx-auto mb-4"}),e.jsx("h3",{className:"text-xl font-semibold text-red-700",children:"Oops! Une erreur est survenue."}),e.jsx("p",{className:"text-red-600 mt-2",children:o})]}):l.length===0?e.jsxs("div",{className:"text-center py-20 bg-neutral-100 rounded-2xl",children:[e.jsx("h3",{className:"text-xl font-semibold text-neutral-700",children:"Aucun voyage trouvé"}),e.jsx("p",{className:"text-neutral-500 mt-2",children:"Essayez d'élargir vos critères de recherche."})]}):e.jsx("div",{className:"grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8",children:l.map(r=>e.jsx(b,{trip:r},r.id))})]})})}export{z as TripsPage};
