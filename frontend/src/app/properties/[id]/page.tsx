// "use client";

// import { useEffect, useState } from "react";
// import { useParams } from "next/navigation";
// import { publicPropertyApi, PublicProperty } from "@/lib/api";
// import FavoriteButton from "@/components/properties/FavoriteButton";

// export default function PropertyDetailsPage() {
//   const params = useParams<{ id: string }>();
//   const [property, setProperty] = useState<PublicProperty | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [activeImage, setActiveImage] = useState(0);

//   useEffect(() => {
//     let cancelled = false;
//     setLoading(true);
//     publicPropertyApi
//       .getById(params.id)
//       .then((res) => { if (!cancelled) setProperty(res.property); })
//       .catch((e) => { if (!cancelled) setError(e instanceof Error ? e.message : "Failed to load property."); })
//       .finally(() => { if (!cancelled) setLoading(false); });
//     return () => { cancelled = true; };
//   }, [params.id]);

//   if (loading) return <div className="max-w-5xl mx-auto px-4 py-8 text-gray-500">Loading...</div>;
//   if (error || !property) return <div className="max-w-5xl mx-auto px-4 py-8 text-red-600">{error ?? "Property not found."}</div>;

//   return (
//     <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
//       <div>
//         <div className="aspect-video rounded-xl overflow-hidden bg-gray-100 relative">
//           {property.images.length > 0 ? (
//             // eslint-disable-next-line @next/next/no-img-element
//             <img src={property.images[activeImage]} alt={property.title} className="h-full w-full object-cover" />
//           ) : (
//             <div className="h-full w-full flex items-center justify-center text-gray-400">No photos</div>
//           )}
//           <FavoriteButton
//             propertyId={property.id}
//             initialFavorited={property.is_favorited}
//             className="absolute top-3 right-3"
//           />
          
//         </div>
//         {property.images.length > 1 && (
//           <div className="flex gap-2 mt-2 overflow-x-auto">
//             {property.images.map((img, i) => (
//               // eslint-disable-next-line @next/next/no-img-element
//               <img
//                 key={img}
//                 src={img}
//                 onClick={() => setActiveImage(i)}
//                 className={`h-16 w-16 object-cover rounded-md cursor-pointer border-2 ${i === activeImage ? "border-blue-500" : "border-transparent"}`}
//                 alt=""
//               />
//             ))}
//           </div>
//         )}
//       </div>

//       <div>
//         <h1 className="text-2xl font-bold text-gray-900">{property.title}</h1>
//         <p className="text-gray-500">
//           {property.address_line1}, {property.city}{property.state ? `, ${property.state}` : ""}
//         </p>
//       </div>

//       <div className="flex flex-wrap gap-6 border-y border-gray-200 py-4">
//         <div>
//           <p className="text-sm text-gray-500">Rent</p>
//           <p className="font-semibold">${property.rent_amount.toLocaleString()}/mo</p>
//         </div>
//         <div>
//           <p className="text-sm text-gray-500">Bedrooms</p>
//           <p className="font-semibold">{property.bedrooms}</p>
//         </div>
//         <div>
//           <p className="text-sm text-gray-500">Bathrooms</p>
//           <p className="font-semibold">{property.bathrooms}</p>
//         </div>
//         {property.area_sqft && (
//           <div>
//             <p className="text-sm text-gray-500">Area</p>
//             <p className="font-semibold">{property.area_sqft} sqft</p>
//           </div>
//         )}
//         <div>
//           <p className="text-sm text-gray-500">Type</p>
//           <p className="font-semibold">{property.property_type}</p>
//         </div>
//       </div>

//       {property.description && (
//         <div>
//           <h2 className="font-semibold text-gray-900 mb-1">Description</h2>
//           <p className="text-gray-700 whitespace-pre-line">{property.description}</p>
//         </div>
//       )}

//       {property.amenities.length > 0 && (
//         <div>
//           <h2 className="font-semibold text-gray-900 mb-2">Amenities</h2>
//           <div className="flex flex-wrap gap-2">
//             {property.amenities.map((a) => (
//               <span key={a} className="text-sm bg-gray-100 rounded-full px-3 py-1">{a}</span>
//             ))}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { publicPropertyApi, PublicProperty } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import FavoriteButton from "@/components/properties/FavoriteButton";
import { ApplyModal } from "@/components/applications/ApplyModal";

export default function PropertyDetailsPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { user } = useAuth();

  const [property, setProperty] = useState<PublicProperty | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeImage, setActiveImage] = useState(0);
  const [applyOpen, setApplyOpen] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    publicPropertyApi
      .getById(params.id)
      .then((res) => { if (!cancelled) setProperty(res.property); })
      .catch((e) => { if (!cancelled) setError(e instanceof Error ? e.message : "Failed to load property."); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [params.id]);

  if (loading) return <div className="max-w-5xl mx-auto px-4 py-8 text-gray-500">Loading...</div>;
  if (error || !property) return <div className="max-w-5xl mx-auto px-4 py-8 text-red-600">{error ?? "Property not found."}</div>;

  const isAvailable = property.status === "AVAILABLE";
  const isTenant = user?.role === "TENANT";
  const canApply = isAvailable && isTenant;
  const mustSignIn = isAvailable && !user;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
      <div>
        <div className="aspect-video rounded-xl overflow-hidden bg-gray-100 relative">
          {property.images.length > 0 ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={property.images[activeImage]} alt={property.title} className="h-full w-full object-cover" />
          ) : (
            <div className="h-full w-full flex items-center justify-center text-gray-400">No photos</div>
          )}
          <FavoriteButton
            propertyId={property.id}
            initialFavorited={property.is_favorited}
            className="absolute top-3 right-3"
          />
        </div>
        {property.images.length > 1 && (
          <div className="flex gap-2 mt-2 overflow-x-auto">
            {property.images.map((img, i) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={img}
                src={img}
                onClick={() => setActiveImage(i)}
                className={`h-16 w-16 object-cover rounded-md cursor-pointer border-2 ${i === activeImage ? "border-blue-500" : "border-transparent"}`}
                alt=""
              />
            ))}
          </div>
        )}
      </div>

      <div>
        <h1 className="text-2xl font-bold text-gray-900">{property.title}</h1>
        <p className="text-gray-500">
          {property.address_line1}, {property.city}{property.state ? `, ${property.state}` : ""}
        </p>
      </div>

      <div className="flex flex-wrap gap-6 border-y border-gray-200 py-4">
        <div>
          <p className="text-sm text-gray-500">Rent</p>
          <p className="font-semibold">${property.rent_amount.toLocaleString()}/mo</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Bedrooms</p>
          <p className="font-semibold">{property.bedrooms}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Bathrooms</p>
          <p className="font-semibold">{property.bathrooms}</p>
        </div>
        {property.area_sqft && (
          <div>
            <p className="text-sm text-gray-500">Area</p>
            <p className="font-semibold">{property.area_sqft} sqft</p>
          </div>
        )}
        <div>
          <p className="text-sm text-gray-500">Type</p>
          <p className="font-semibold">{property.property_type}</p>
        </div>
      </div>

      {/* ─── Apply CTA ──────────────────────────────────────────────────── */}
      {canApply && (
        <div className="rounded-xl border border-blue-200 bg-blue-50 p-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="font-semibold text-gray-900">Interested in this property?</p>
            <p className="text-sm text-gray-600">Submit a rental application — it takes a couple of minutes.</p>
          </div>
          <button
            onClick={() => setApplyOpen(true)}
            className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-700"
          >
            Apply now
          </button>
        </div>
      )}

      {mustSignIn && (
        <div className="rounded-xl border border-blue-200 bg-blue-50 p-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="font-semibold text-gray-900">Interested in this property?</p>
            <p className="text-sm text-gray-600">Sign in as a tenant to submit an application.</p>
          </div>
          <button
            onClick={() => router.push(`/login?redirect=/properties/${property.id}`)}
            className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-700"
          >
            Sign in to apply
          </button>
        </div>
      )}

      {!isAvailable && (
        <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 text-sm text-gray-600">
          This property is not currently accepting applications.
        </div>
      )}

      {property.description && (
        <div>
          <h2 className="font-semibold text-gray-900 mb-1">Description</h2>
          <p className="text-gray-700 whitespace-pre-line">{property.description}</p>
        </div>
      )}

      {property.amenities.length > 0 && (
        <div>
          <h2 className="font-semibold text-gray-900 mb-2">Amenities</h2>
          <div className="flex flex-wrap gap-2">
            {property.amenities.map((a) => (
              <span key={a} className="text-sm bg-gray-100 rounded-full px-3 py-1">{a}</span>
            ))}
          </div>
        </div>
      )}

      {applyOpen && (
        <ApplyModal
          propertyId={property.id}
          propertyTitle={property.title}
          open={applyOpen}
          onClose={() => setApplyOpen(false)}
          onSubmitted={(id) => {
            setApplyOpen(false);
            router.push(`/applications/${id}`);
          }}
        />
      )}
    </div>
  );
}