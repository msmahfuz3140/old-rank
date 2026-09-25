export interface IBDDistrict {
  id: string;
  name: string;
  nameBn: string;
  nameEn: string;
  division: string;
  divisionBn: string;
  deliveryCharge: number;
  estimatedDelivery: string;
}

export interface IBDDivision {
  id: string;
  nameEn: string;
  nameBn: string;
}

export const BANGLADESH_DIVISIONS: IBDDivision[] = [
  { id: "All", nameEn: "All Divisions", nameBn: "সকল বিভাগ" },
  { id: "Dhaka", nameEn: "Dhaka", nameBn: "ঢাকা" },
  { id: "Chattogram", nameEn: "Chattogram", nameBn: "চট্টগ্রাম" },
  { id: "Rajshahi", nameEn: "Rajshahi", nameBn: "রাজশাহী" },
  { id: "Khulna", nameEn: "Khulna", nameBn: "খুলনা" },
  { id: "Barishal", nameEn: "Barishal", nameBn: "বরিশাল" },
  { id: "Sylhet", nameEn: "Sylhet", nameBn: "সিলেট" },
  { id: "Rangpur", nameEn: "Rangpur", nameBn: "রংপুর" },
  { id: "Mymensingh", nameEn: "Mymensingh", nameBn: "ময়মনসিংহ" },
];

export const BANGLADESH_64_DISTRICTS: IBDDistrict[] = [
  // 1. ঢাকা বিভাগ (Dhaka Division - 13 Districts)
  { id: "dhaka", name: "Dhaka (ঢাকা)", nameEn: "Dhaka", nameBn: "ঢাকা", division: "Dhaka", divisionBn: "ঢাকা", deliveryCharge: 60, estimatedDelivery: "24-48 Hours" },
  { id: "gazipur", name: "Gazipur (গাজীপুর)", nameEn: "Gazipur", nameBn: "গাজীপুর", division: "Dhaka", divisionBn: "ঢাকা", deliveryCharge: 100, estimatedDelivery: "48-72 Hours" },
  { id: "narayanganj", name: "Narayanganj (নারায়ণগঞ্জ)", nameEn: "Narayanganj", nameBn: "নারায়ণগঞ্জ", division: "Dhaka", divisionBn: "ঢাকা", deliveryCharge: 100, estimatedDelivery: "48-72 Hours" },
  { id: "tangail", name: "Tangail (টাঙ্গাইল)", nameEn: "Tangail", nameBn: "টাঙ্গাইল", division: "Dhaka", divisionBn: "ঢাকা", deliveryCharge: 120, estimatedDelivery: "2-3 Days" },
  { id: "kishoreganj", name: "Kishoreganj (কিশোরগঞ্জ)", nameEn: "Kishoreganj", nameBn: "কিশোরগঞ্জ", division: "Dhaka", divisionBn: "ঢাকা", deliveryCharge: 120, estimatedDelivery: "2-3 Days" },
  { id: "manikganj", name: "Manikganj (মানিকগঞ্জ)", nameEn: "Manikganj", nameBn: "মানিকগঞ্জ", division: "Dhaka", divisionBn: "ঢাকা", deliveryCharge: 120, estimatedDelivery: "2-3 Days" },
  { id: "munshiganj", name: "Munshiganj (মুন্সীগঞ্জ)", nameEn: "Munshiganj", nameBn: "মুন্সীগঞ্জ", division: "Dhaka", divisionBn: "ঢাকা", deliveryCharge: 120, estimatedDelivery: "2-3 Days" },
  { id: "narsingdi", name: "Narsingdi (নরসিংদী)", nameEn: "Narsingdi", nameBn: "নরসিংদী", division: "Dhaka", divisionBn: "ঢাকা", deliveryCharge: 120, estimatedDelivery: "2-3 Days" },
  { id: "faridpur", name: "Faridpur (ফরিদপুর)", nameEn: "Faridpur", nameBn: "ফরিদপুর", division: "Dhaka", divisionBn: "ঢাকা", deliveryCharge: 120, estimatedDelivery: "2-3 Days" },
  { id: "gopalganj", name: "Gopalganj (গোপালগঞ্জ)", nameEn: "Gopalganj", nameBn: "গোপালগঞ্জ", division: "Dhaka", divisionBn: "ঢাকা", deliveryCharge: 120, estimatedDelivery: "2-3 Days" },
  { id: "madaripur", name: "Madaripur (মাদারীপুর)", nameEn: "Madaripur", nameBn: "মাদারীপুর", division: "Dhaka", divisionBn: "ঢাকা", deliveryCharge: 120, estimatedDelivery: "2-3 Days" },
  { id: "rajbari", name: "Rajbari (রাজবাড়ী)", nameEn: "Rajbari", nameBn: "রাজবাড়ী", division: "Dhaka", divisionBn: "ঢাকা", deliveryCharge: 120, estimatedDelivery: "2-3 Days" },
  { id: "shariatpur", name: "Shariatpur (শরীয়তপুর)", nameEn: "Shariatpur", nameBn: "শরীয়তপুর", division: "Dhaka", divisionBn: "ঢাকা", deliveryCharge: 120, estimatedDelivery: "2-3 Days" },

  // 2. চট্টগ্রাম বিভাগ (Chattogram Division - 11 Districts)
  { id: "chattogram", name: "Chattogram (চট্টগ্রাম)", nameEn: "Chattogram", nameBn: "চট্টগ্রাম", division: "Chattogram", divisionBn: "চট্টগ্রাম", deliveryCharge: 120, estimatedDelivery: "2-3 Days" },
  { id: "coxs_bazar", name: "Cox's Bazar (কক্সবাজার)", nameEn: "Cox's Bazar", nameBn: "কক্সবাজার", division: "Chattogram", divisionBn: "চট্টগ্রাম", deliveryCharge: 120, estimatedDelivery: "3-4 Days" },
  { id: "cumilla", name: "Cumilla (কুমিল্লা)", nameEn: "Cumilla", nameBn: "কুমিল্লা", division: "Chattogram", divisionBn: "চট্টগ্রাম", deliveryCharge: 120, estimatedDelivery: "2-3 Days" },
  { id: "feni", name: "Feni (ফেনী)", nameEn: "Feni", nameBn: "ফেনী", division: "Chattogram", divisionBn: "চট্টগ্রাম", deliveryCharge: 120, estimatedDelivery: "2-3 Days" },
  { id: "brahmanbaria", name: "Brahmanbaria (ব্রাহ্মণবাড়িয়া)", nameEn: "Brahmanbaria", nameBn: "ব্রাহ্মণবাড়িয়া", division: "Chattogram", divisionBn: "চট্টগ্রাম", deliveryCharge: 120, estimatedDelivery: "2-3 Days" },
  { id: "noakhali", name: "Noakhali (নোয়াখালী)", nameEn: "Noakhali", nameBn: "নোয়াখালী", division: "Chattogram", divisionBn: "চট্টগ্রাম", deliveryCharge: 120, estimatedDelivery: "2-3 Days" },
  { id: "chandpur", name: "Chandpur (চাঁদপুর)", nameEn: "Chandpur", nameBn: "চাঁদপুর", division: "Chattogram", divisionBn: "চট্টগ্রাম", deliveryCharge: 120, estimatedDelivery: "2-3 Days" },
  { id: "lakshmipur", name: "Lakshmipur (লক্ষ্মীপুর)", nameEn: "Lakshmipur", nameBn: "লক্ষ্মীপুর", division: "Chattogram", divisionBn: "চট্টগ্রাম", deliveryCharge: 120, estimatedDelivery: "2-3 Days" },
  { id: "rangamati", name: "Rangamati (রাঙ্গামাটি)", nameEn: "Rangamati", nameBn: "রাঙ্গামাটি", division: "Chattogram", divisionBn: "চট্টগ্রাম", deliveryCharge: 120, estimatedDelivery: "3-4 Days" },
  { id: "bandarban", name: "Bandarban (বান্দরবান)", nameEn: "Bandarban", nameBn: "বান্দরবান", division: "Chattogram", divisionBn: "চট্টগ্রাম", deliveryCharge: 120, estimatedDelivery: "3-4 Days" },
  { id: "khagrachhari", name: "Khagrachhari (খাগড়াছড়ি)", nameEn: "Khagrachhari", nameBn: "খাগড়াছড়ি", division: "Chattogram", divisionBn: "চট্টগ্রাম", deliveryCharge: 120, estimatedDelivery: "3-4 Days" },

  // 3. রাজশাহী বিভাগ (Rajshahi Division - 8 Districts)
  { id: "rajshahi", name: "Rajshahi (রাজশাহী)", nameEn: "Rajshahi", nameBn: "রাজশাহী", division: "Rajshahi", divisionBn: "রাজশাহী", deliveryCharge: 120, estimatedDelivery: "2-3 Days" },
  { id: "bogura", name: "Bogura (বগুড়া)", nameEn: "Bogura", nameBn: "বগুড়া", division: "Rajshahi", divisionBn: "রাজশাহী", deliveryCharge: 120, estimatedDelivery: "2-3 Days" },
  { id: "pabna", name: "Pabna (পাবনা)", nameEn: "Pabna", nameBn: "পাবনা", division: "Rajshahi", divisionBn: "রাজশাহী", deliveryCharge: 120, estimatedDelivery: "2-3 Days" },
  { id: "sirajganj", name: "Sirajganj (সিরাজগঞ্জ)", nameEn: "Sirajganj", nameBn: "সিরাজগঞ্জ", division: "Rajshahi", divisionBn: "রাজশাহী", deliveryCharge: 120, estimatedDelivery: "2-3 Days" },
  { id: "naogaon", name: "Naogaon (নওগাঁ)", nameEn: "Naogaon", nameBn: "নওগাঁ", division: "Rajshahi", divisionBn: "রাজশাহী", deliveryCharge: 120, estimatedDelivery: "2-3 Days" },
  { id: "natore", name: "Natore (নাটোর)", nameEn: "Natore", nameBn: "নাটোর", division: "Rajshahi", divisionBn: "রাজশাহী", deliveryCharge: 120, estimatedDelivery: "2-3 Days" },
  { id: "chapai_nawabganj", name: "Chapai Nawabganj (চাঁপাইনবাবগঞ্জ)", nameEn: "Chapai Nawabganj", nameBn: "চাঁপাইনবাবগঞ্জ", division: "Rajshahi", divisionBn: "রাজশাহী", deliveryCharge: 120, estimatedDelivery: "2-3 Days" },
  { id: "joypurhat", name: "Joypurhat (জয়পুরহাট)", nameEn: "Joypurhat", nameBn: "জয়পুরহাট", division: "Rajshahi", divisionBn: "রাজশাহী", deliveryCharge: 120, estimatedDelivery: "2-3 Days" },

  // 4. খুলনা বিভাগ (Khulna Division - 10 Districts)
  { id: "khulna", name: "Khulna (খুলনা)", nameEn: "Khulna", nameBn: "খুলনা", division: "Khulna", divisionBn: "খুলনা", deliveryCharge: 120, estimatedDelivery: "2-3 Days" },
  { id: "jashore", name: "Jashore (যশোর)", nameEn: "Jashore", nameBn: "যশোর", division: "Khulna", divisionBn: "খুলনা", deliveryCharge: 120, estimatedDelivery: "2-3 Days" },
  { id: "kushtia", name: "Kushtia (কুষ্টিয়া)", nameEn: "Kushtia", nameBn: "কুষ্টিয়া", division: "Khulna", divisionBn: "খুলনা", deliveryCharge: 120, estimatedDelivery: "2-3 Days" },
  { id: "jhenaidah", name: "Jhenaidah (ঝিনাইদহ)", nameEn: "Jhenaidah", nameBn: "ঝিনাইদহ", division: "Khulna", divisionBn: "খুলনা", deliveryCharge: 120, estimatedDelivery: "2-3 Days" },
  { id: "satkhira", name: "Satkhira (সাতক্ষীরা)", nameEn: "Satkhira", nameBn: "সাতক্ষীরা", division: "Khulna", divisionBn: "খুলনা", deliveryCharge: 120, estimatedDelivery: "2-3 Days" },
  { id: "bagerhat", name: "Bagerhat (বাগেরহাট)", nameEn: "Bagerhat", nameBn: "বাগেরহাট", division: "Khulna", divisionBn: "খুলনা", deliveryCharge: 120, estimatedDelivery: "2-3 Days" },
  { id: "chuadanga", name: "Chuadanga (চুয়াডাঙ্গা)", nameEn: "Chuadanga", nameBn: "চুয়াডাঙ্গা", division: "Khulna", divisionBn: "খুলনা", deliveryCharge: 120, estimatedDelivery: "2-3 Days" },
  { id: "meherpur", name: "Meherpur (মেহেরপুর)", nameEn: "Meherpur", nameBn: "মেহেরপুর", division: "Khulna", divisionBn: "খুলনা", deliveryCharge: 120, estimatedDelivery: "2-3 Days" },
  { id: "magura", name: "Magura (মাগুরা)", nameEn: "Magura", nameBn: "মাগুরা", division: "Khulna", divisionBn: "খুলনা", deliveryCharge: 120, estimatedDelivery: "2-3 Days" },
  { id: "narail", name: "Narail (নড়াইল)", nameEn: "Narail", nameBn: "নড়াইল", division: "Khulna", divisionBn: "খুলনা", deliveryCharge: 120, estimatedDelivery: "2-3 Days" },

  // 5. বরিশাল বিভাগ (Barishal Division - 6 Districts)
  { id: "barishal", name: "Barishal (বরিশাল)", nameEn: "Barishal", nameBn: "বরিশাল", division: "Barishal", divisionBn: "বরিশাল", deliveryCharge: 120, estimatedDelivery: "2-3 Days" },
  { id: "patuakhali", name: "Patuakhali (পটুয়াখালী)", nameEn: "Patuakhali", nameBn: "পটুয়াখালী", division: "Barishal", divisionBn: "বরিশাল", deliveryCharge: 120, estimatedDelivery: "3-4 Days" },
  { id: "bhola", name: "Bhola (ভোলা)", nameEn: "Bhola", nameBn: "ভোলা", division: "Barishal", divisionBn: "বরিশাল", deliveryCharge: 120, estimatedDelivery: "3-4 Days" },
  { id: "pirojpur", name: "Pirojpur (পিরোজপুর)", nameEn: "Pirojpur", nameBn: "পিরোজপুর", division: "Barishal", divisionBn: "বরিশাল", deliveryCharge: 120, estimatedDelivery: "2-3 Days" },
  { id: "barguna", name: "Barguna (বরগুনা)", nameEn: "Barguna", nameBn: "বরগুনা", division: "Barishal", divisionBn: "বরিশাল", deliveryCharge: 120, estimatedDelivery: "3-4 Days" },
  { id: "jhalakathi", name: "Jhalakathi (ঝালকাঠি)", nameEn: "Jhalakathi", nameBn: "ঝালকাঠি", division: "Barishal", divisionBn: "বরিশাল", deliveryCharge: 120, estimatedDelivery: "2-3 Days" },

  // 6. সিলেট বিভাগ (Sylhet Division - 4 Districts)
  { id: "sylhet", name: "Sylhet (সিলেট)", nameEn: "Sylhet", nameBn: "সিলেট", division: "Sylhet", divisionBn: "সিলেট", deliveryCharge: 120, estimatedDelivery: "2-3 Days" },
  { id: "moulvibazar", name: "Moulvibazar (মৌলভীবাজার)", nameEn: "Moulvibazar", nameBn: "মৌলভীবাজার", division: "Sylhet", divisionBn: "সিলেট", deliveryCharge: 120, estimatedDelivery: "2-3 Days" },
  { id: "habiganj", name: "Habiganj (হবিগঞ্জ)", nameEn: "Habiganj", nameBn: "হবিগঞ্জ", division: "Sylhet", divisionBn: "সিলেট", deliveryCharge: 120, estimatedDelivery: "2-3 Days" },
  { id: "sunamganj", name: "Sunamganj (সুনামগঞ্জ)", nameEn: "Sunamganj", nameBn: "সুনামগঞ্জ", division: "Sylhet", divisionBn: "সিলেট", deliveryCharge: 120, estimatedDelivery: "2-3 Days" },

  // 7. রংপুর বিভাগ (Rangpur Division - 8 Districts)
  { id: "rangpur", name: "Rangpur (রংপুর)", nameEn: "Rangpur", nameBn: "রংপুর", division: "Rangpur", divisionBn: "রংপুর", deliveryCharge: 120, estimatedDelivery: "2-3 Days" },
  { id: "dinajpur", name: "Dinajpur (দিনাজপুর)", nameEn: "Dinajpur", nameBn: "দিনাজপুর", division: "Rangpur", divisionBn: "রংপুর", deliveryCharge: 120, estimatedDelivery: "2-3 Days" },
  { id: "kurigram", name: "Kurigram (কুড়িগ্রাম)", nameEn: "Kurigram", nameBn: "কুড়িগ্রাম", division: "Rangpur", divisionBn: "রংপুর", deliveryCharge: 120, estimatedDelivery: "3-4 Days" },
  { id: "gaibandha", name: "Gaibandha (গাইবান্ধা)", nameEn: "Gaibandha", nameBn: "গাইবান্ধা", division: "Rangpur", divisionBn: "রংপুর", deliveryCharge: 120, estimatedDelivery: "2-3 Days" },
  { id: "nilphamari", name: "Nilphamari (নীলফামারী)", nameEn: "Nilphamari", nameBn: "নীলফামারী", division: "Rangpur", divisionBn: "রংপুর", deliveryCharge: 120, estimatedDelivery: "2-3 Days" },
  { id: "panchagarh", name: "Panchagarh (পঞ্চগড়)", nameEn: "Panchagarh", nameBn: "পঞ্চগড়", division: "Rangpur", divisionBn: "রংপুর", deliveryCharge: 120, estimatedDelivery: "3-4 Days" },
  { id: "thakurgaon", name: "Thakurgaon (ঠাকুরগাঁও)", nameEn: "Thakurgaon", nameBn: "ঠাকুরগাঁও", division: "Rangpur", divisionBn: "রংপুর", deliveryCharge: 120, estimatedDelivery: "3-4 Days" },
  { id: "lalmonirhat", name: "Lalmonirhat (লালমনিরহাট)", nameEn: "Lalmonirhat", nameBn: "লালমনিরহাট", division: "Rangpur", divisionBn: "রংপুর", deliveryCharge: 120, estimatedDelivery: "3-4 Days" },

  // 8. ময়মনসিংহ বিভাগ (Mymensingh Division - 4 Districts)
  { id: "mymensingh", name: "Mymensingh (ময়মনসিংহ)", nameEn: "Mymensingh", nameBn: "ময়মনসিংহ", division: "Mymensingh", divisionBn: "ময়মনসিংহ", deliveryCharge: 120, estimatedDelivery: "2-3 Days" },
  { id: "jamalpur", name: "Jamalpur (জামালপুর)", nameEn: "Jamalpur", nameBn: "জামালপুর", division: "Mymensingh", divisionBn: "ময়মনসিংহ", deliveryCharge: 120, estimatedDelivery: "2-3 Days" },
  { id: "sherpur", name: "Sherpur (শেরপুর)", nameEn: "Sherpur", nameBn: "শেরপুর", division: "Mymensingh", divisionBn: "ময়মনসিংহ", deliveryCharge: 120, estimatedDelivery: "2-3 Days" },
  { id: "netrokona", name: "Netrokona (নেত্রকোণা)", nameEn: "Netrokona", nameBn: "নেত্রকোণা", division: "Mymensingh", divisionBn: "ময়মনসিংহ", deliveryCharge: 120, estimatedDelivery: "2-3 Days" },
];

export function getDistrictsByDivision(division?: string): IBDDistrict[] {
  if (!division || division === "All") {
    return BANGLADESH_64_DISTRICTS;
  }
  return BANGLADESH_64_DISTRICTS.filter(
    (d) => d.division.toLowerCase() === division.toLowerCase()
  );
}

export function findDistrict(query: string): IBDDistrict | undefined {
  if (!query) return undefined;
  const q = query.trim().toLowerCase();
  return BANGLADESH_64_DISTRICTS.find(
    (d) =>
      d.name.toLowerCase() === q ||
      d.nameEn.toLowerCase() === q ||
      d.nameBn.toLowerCase() === q ||
      d.id.toLowerCase() === q ||
      q.includes(d.nameEn.toLowerCase()) ||
      q.includes(d.nameBn)
  );
}
