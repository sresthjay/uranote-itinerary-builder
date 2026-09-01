export interface Region {
    id: string;
    name: string;

    inclusions: string[];
    exclusions: string[];

    terms: string[];
}

export const regions: Region[] = [
    {
        id: "himachal",
        name: "Himachal Pradesh",

        inclusions: [
            "Himachal Pradesh per-day vehicle taxes",
        ],

        exclusions: [],

        /*
        |--------------------------------------------------------------------------
        | Himachal Pradesh – Regional Terms & Important Instructions
        |--------------------------------------------------------------------------
        */

        terms: [
            "Please take a printout of the final itinerary and carry it with you during the tour. The final itinerary and voucher shared with you will be considered the applicable reference for the confirmed services.",

            "Sightseeing timings in Himachal Pradesh are generally 9:00 a.m. to 5:00 p.m. during the winter season and 8:00 a.m. to 6:00 p.m. during the rest of the year. Sightseeing will be conducted within the applicable operating hours.",

            "All sightseeing places mentioned in the confirmed package will be covered once during the tour. A particular sightseeing location will not normally be repeated unless specifically agreed in advance.",

            "During winter and monsoon seasons, access to certain sightseeing locations, particularly those outside major highways, may be restricted or blocked due to snowfall, landslides, heavy rainfall, road conditions, or other circumstances beyond our control. In such cases, the affected sightseeing may not be possible.",

            "During periods of heavy tourist traffic, particularly in popular destinations such as Shimla and Manali, traffic congestion may affect the number of sightseeing places that can be covered within the available time. Every reasonable effort will be made to cover the important places included in the confirmed itinerary.",

            "The specific vehicle requested is subject to availability. If the requested vehicle is unavailable, a similar vehicle of comparable category may be provided.",

            "Rohtang Pass sightseeing is subject to seasonal accessibility, weather conditions, government regulations, local permissions, and road conditions. Access may be restricted or unavailable during adverse weather or whenever authorities restrict tourist movement.",

            "Himachal Pradesh involves significant changes in altitude, temperature, and road conditions. Some travelers may experience discomfort such as headache, nausea, motion sickness, or stomach-related issues. Travelers are advised to carry any personal medicines they may require during the tour.",

            "The package and quotation are prepared according to the requirements shared by the customer. The quotation remains customizable only until it is finalized. Once the package and quotation are confirmed, changes may be subject to availability and additional charges.",

            "If a customer chooses not to use any of the confirmed services after commencement of the tour, the customer will remain liable for the amount specified in the confirmed voucher or payment schedule. Unused services are not automatically eligible for a refund.",

            "Customers are advised not to modify the confirmed tour plan during the trip. If the number of travel days is reduced after commencement of the tour, the total confirmed package price will not automatically be reduced.",

            "Any sightseeing location or service not included in the final confirmed quotation or itinerary will be treated as an additional service and may attract additional charges. Such additions are subject to availability, local conditions, and operational feasibility.",

            "If a customer chooses to terminate or discontinue the tour before the scheduled completion date, the applicable charges and payment obligations will be governed by the confirmed voucher and cancellation policy.",

            "We take reasonable care in providing transportation, drivers, hotels, and other confirmed services. Customers are expected to treat drivers, hotel staff, and service partners respectfully. In case of any service-related concern, customers should contact us promptly so that we can assist in resolving the issue.",

            "If payment is not made according to the agreed payment schedule or confirmed voucher, the service provider reserves the right to suspend or terminate the pending services, subject to the applicable terms and circumstances.",

            "The service provider will not be responsible for loss, theft, damage, or misplacement of personal belongings. Customers are responsible for keeping their valuables and personal belongings secure throughout the tour.",

            "Air-conditioning will be switched off in certain hilly and high-altitude areas due to vehicle operating conditions, road conditions, or local regulations. Where applicable, additional charges for AC operation in such areas may be payable directly on the spot.",

            "For any assistance or service-related concern before or during the tour, please contact the contact details provided in your itinerary or voucher. Our team will make reasonable efforts to assist and resolve the issue at the earliest.",
        ],
    },

    {
        id: "uttarakhand",
        name: "Uttarakhand",

        inclusions: [
            // Uttarakhand-specific inclusions
        ],

        exclusions: [
            // Uttarakhand-specific exclusions
        ],

        terms: [
            "Please take a printout of the final itinerary and carry it with you during the tour. The final itinerary and voucher shared with you will be considered the applicable reference for the confirmed services.",


            "Sightseeing and travel timings in Uttarakhand may vary depending on the destination, season, local regulations, traffic conditions, weather, and operating hours of individual sightseeing places. The itinerary will be operated within the applicable timings and practical travel conditions.",

            "All sightseeing places mentioned in the confirmed package will be covered once during the tour. A particular sightseeing location will not normally be repeated unless specifically agreed in advance.",

            "During monsoon, winter, and other periods of adverse weather, access to certain destinations and sightseeing locations in Uttarakhand may be restricted or blocked due to landslides, heavy rainfall, snowfall, road damage, falling rocks, waterlogging, road closures, or other circumstances beyond our control. In such cases, the affected sightseeing or route may not be possible.",

            "During periods of heavy tourist traffic, particularly in popular destinations such as Nainital, Mussoorie, Rishikesh, Haridwar, Jim Corbett, Auli, and other major tourist areas, traffic congestion, parking restrictions, vehicle-entry restrictions, and local traffic regulations may affect the number of sightseeing places that can be covered within the available time.",

            "The specific vehicle requested is subject to availability and applicable local regulations. If the requested vehicle is unavailable or restricted on a particular route, a similar vehicle of comparable category may be provided or an alternative vehicle may be arranged where operationally feasible.",

            "Certain hill routes in Uttarakhand are subject to vehicle-size, route, permit, safety, and local transport restrictions. A vehicle suitable for one destination may not necessarily be permitted or practical on every hill route. Any required vehicle change, local transfer, shuttle, or alternative transportation will be subject to availability and applicable charges.",

            "Char Dham and Hemkund Sahib Yatra services are subject to mandatory pilgrim and vehicle registration, government regulations, route restrictions, verification requirements, available registration slots, weather conditions, and local administrative directions. Customers are responsible for providing accurate traveller and identification details required for registration and must carry the applicable registration documents during the Yatra.",

            "Char Dham destinations including Yamunotri, Gangotri, Kedarnath, and Badrinath involve high-altitude travel, long road journeys, steep terrain, trekking or walking requirements at certain locations, and changing weather conditions. Customers should be physically prepared for the journey and carry prescribed personal medicines and suitable clothing.",

            "Road access to Char Dham destinations may be restricted or temporarily suspended due to weather conditions, landslides, road damage, traffic management, government orders, pilgrimage regulations, or other circumstances beyond our control. If a Dham or route becomes inaccessible, the affected visit may not be possible and no automatic refund will apply for services affected by such circumstances.",

            "For Kedarnath, Yamunotri, and other pilgrimage destinations where the final approach requires walking, pony, palki, helicopter, shuttle, or other local transportation, such services are subject to availability, government regulations, weather conditions, operational schedules, and separate charges unless specifically included in the confirmed package.",

            "Darshan, registration, entry, accommodation, helicopter services, pony or palki services, and other pilgrimage-related arrangements are subject to availability and applicable government, temple, local authority, or service-provider regulations. Confirmation of the tour package does not by itself guarantee priority darshan, helicopter seats, or other services unless specifically confirmed.",

            "For Jim Corbett National Park and Corbett Tiger Reserve, safari permits are subject to availability, zone-wise restrictions, government regulations, prescribed timings, passenger details, and the rules of the forest authorities. Safari permits are issued against the registered traveller details and may not be transferable or changeable after confirmation.",

            "Corbett safari operations are conducted using vehicles and guides authorized by the Corbett Tiger Reserve. The regular tour vehicle used for the journey to and from Corbett cannot automatically be used as a safari vehicle. Safari charges, permits, guide charges, and other applicable fees will be payable separately unless specifically included in the confirmed package.",

            "Corbett safari zones, entry gates, safari timings, vehicle availability, and permitted safari routes are controlled by the forest authorities and may vary by season or government direction. A particular safari zone or wildlife sighting cannot be guaranteed.",

            "Visitors entering Corbett Tiger Reserve must follow all applicable forest and wildlife regulations, including restrictions relating to food, alcohol, smoking, noise, littering, wildlife interaction, designated routes, and vehicle movement. Any penalty or loss arising from a customer's violation of such regulations will be the customer's responsibility.",

            "In destinations such as Nainital and Mussoorie, vehicle entry, parking, traffic movement, and sightseeing access may be regulated by local authorities, particularly during peak tourist periods. Customers may be required to use designated parking areas, local shuttle services, or walk to certain sightseeing locations where direct vehicle access is restricted.",

            "In destinations such as Auli, Munsiyari, Chopta, Dhanaulti, Kanatal, Binsar, and other remote or high-altitude areas, road conditions and vehicle accessibility may vary significantly depending on weather and local conditions. The final approach may require a suitable local vehicle or may be subject to temporary access restrictions.",

            "The package and quotation are prepared according to the requirements shared by the customer. The quotation remains customizable only until it is finalized. Once the package and quotation are confirmed, changes may be subject to availability and additional charges.",

            "If a customer chooses not to use any of the confirmed services after commencement of the tour, the customer will remain liable for the amount specified in the confirmed voucher or payment schedule. Unused services are not automatically eligible for a refund.",

            "Customers are advised not to modify the confirmed tour plan during the trip. If the number of travel days is reduced after commencement of the tour, the total confirmed package price will not automatically be reduced.",

            "Any sightseeing location, route, activity, permit, service, or transportation not included in the final confirmed quotation or itinerary will be treated as an additional service and may attract additional charges. Such additions are subject to availability, local regulations, and operational feasibility.",

            "If a customer chooses to terminate or discontinue the tour before the scheduled completion date, the applicable charges and payment obligations will be governed by the confirmed voucher and cancellation policy.",

            "We take reasonable care in providing transportation, drivers, hotels, and other confirmed services. Customers are expected to treat drivers, hotel staff, guides, and service partners respectfully. In case of any service-related concern, customers should contact us promptly so that we can assist in resolving the issue.",

            "If payment is not made according to the agreed payment schedule or confirmed voucher, the service provider reserves the right to suspend or terminate the pending services, subject to the applicable terms and circumstances.",

            "The service provider will not be responsible for loss, theft, damage, or misplacement of personal belongings. Customers are responsible for keeping their valuables and personal belongings secure throughout the tour.",

            "Night driving on hill roads may be restricted or avoided where reasonably possible for safety reasons. Travel schedules may therefore be adjusted to ensure that vehicles reach destinations within practical and safe operating conditions.",

            "Air-conditioning may be switched off in certain hilly and high-altitude areas due to vehicle operating conditions, road gradients, road conditions, weather, or local regulations. Where applicable, additional charges for AC operation in such areas may be payable directly on the spot.",

            "For any assistance or service-related concern before or during the tour, please contact the contact details provided in your itinerary or voucher. Our team will make reasonable efforts to assist and resolve the issue at the earliest.",


        ],

    },

    {
        id: "ladakh",
        name: "Ladakh",

        inclusions: [
            "Inner Line Permit for the vehicle as required for the confirmed itinerary",
        ],

        exclusions: [
            "Inner Line Permit or other applicable permits required for passengers unless specifically mentioned in the inclusions",
            "Oxygen cylinders, portable oxygen, or other altitude-related medical equipment unless specifically mentioned in the inclusions",
        ],

        terms: [
            "Please take a printout of the final itinerary and carry it with you during the tour. The final itinerary and voucher shared with you will be considered the applicable reference for the confirmed services.",


            "Sightseeing and travel timings in Ladakh may vary depending on the destination, season, weather conditions, road conditions, local regulations, security requirements, and operating conditions. The itinerary will be operated within practical and safe travel conditions.",

            "All sightseeing places mentioned in the confirmed package will be covered once during the tour. A particular sightseeing location will not normally be repeated unless specifically agreed in advance.",

            "Ladakh is a high-altitude region with challenging terrain and rapidly changing weather conditions. Customers should allow adequate time for acclimatization after arrival in Leh before travelling to higher-altitude destinations. The Ladakh Tourism Department currently advises a minimum 48-hour acclimatization period in Leh before travelling to higher-altitude areas.",

            "Customers are responsible for assessing their fitness for high-altitude travel and are advised to consult a qualified medical professional before travelling to Ladakh, particularly in case of heart, lung, blood-pressure, or other medical conditions that may be affected by high altitude. Customers should carry sufficient personal medicines and any medically recommended medication required during the tour.",

            "If a customer develops symptoms of altitude sickness or any other health-related problem during the tour, the itinerary may need to be modified, delayed, curtailed, or terminated based on medical advice and operational feasibility. Any additional expenses arising from medical treatment, evacuation, accommodation extension, transportation changes, or early departure will be borne by the customer unless specifically covered by insurance or otherwise agreed.",

            "During winter and periods of adverse weather, access to certain destinations and high-altitude passes may be restricted or blocked due to snowfall, ice, road closures, avalanches, landslides, extreme temperatures, poor visibility, mechanical or operational restrictions, or government and security directions. In such cases, the affected sightseeing or route may not be possible.",

            "Routes and high-altitude passes including Khardung La, Chang La, Umling La, Tanglang La, Fotu La, Namika La, and other mountain passes are subject to weather, road conditions, government regulations, security restrictions, and local operational conditions. Reaching a particular pass or viewpoint cannot be guaranteed solely because it is mentioned in the itinerary.",

            "Travel to destinations such as Nubra Valley, Pangong Tso, Tso Moriri, Hanle, Turtuk, Dha-Hanu, Umling La, Zanskar, and other remote areas is subject to road conditions, weather, permits, security restrictions, local regulations, and vehicle accessibility. The final route may be modified where required for safety or operational reasons.",

            "Certain areas of Ladakh are subject to Protected Area Permit, Restricted Area Permit, Inner Line Permit, environmental, security, or other regulatory requirements. Where applicable, travel to such areas will be subject to the issuance and validity of the required permits and compliance with the prevailing regulations.",

            "Customers are responsible for providing accurate identification and traveller information required for permits, registrations, hotel check-ins, or other mandatory formalities. Any delay, denial, restriction, or additional cost arising from incorrect, incomplete, or unavailable documentation will be the customer's responsibility.",

            "Permit requirements, permitted routes, restricted areas, and entry regulations may change from time to time based on directions issued by the Administration of UT Ladakh, security authorities, wildlife authorities, or other competent authorities. Any such changes will apply to the confirmed tour where relevant.",

            "Ladakh is a protected and environmentally sensitive region. Customers must not drive or request the vehicle to drive off designated roads or into lakes, streams, wetlands, wildlife habitats, or other restricted areas. Any penalty, vehicle seizure, damage, or other liability arising from illegal off-roading or violation of environmental or wildlife regulations will be borne entirely by the customer.",

            "Pangong Tso, Tso Moriri, Tso Kar, Nubra Valley, Hanle, and other ecologically sensitive areas are subject to environmental and wildlife regulations. Customers must not litter, disturb wildlife, enter restricted areas, or undertake activities prohibited by the authorities.",

            "The specific vehicle requested is subject to availability and applicable local transport regulations. If the requested vehicle is unavailable or restricted on a particular route, a similar vehicle of comparable category may be provided or an alternative vehicle may be arranged where operationally feasible.",

            "Ladakh has local commercial vehicle and route regulations, and a vehicle originating from outside Ladakh may not necessarily be permitted to operate for all local sightseeing or inter-destination routes. Where local transportation is required due to applicable regulations, the customer may be required to use an authorized local vehicle, subject to availability and applicable charges.",

            "For remote destinations and high-altitude routes, vehicle travel times can vary significantly due to road conditions, traffic, checkpoints, weather, altitude, construction work, and other operational factors. Published or estimated travel times should therefore be treated as approximate.",

            "During periods of heavy tourist traffic, particularly around Leh, Nubra Valley, Pangong Tso, Khardung La, Chang La, and other popular destinations, traffic congestion, checkpoints, parking restrictions, road conditions, and local traffic management may affect the number of sightseeing places that can be covered within the available time.",

            "Pangong Tso is located at high altitude and is subject to rapidly changing weather and road conditions. Access to the lake, specific viewpoints, nearby villages, or particular sections of the route may be restricted due to weather, environmental regulations, security restrictions, or local administrative directions.",

            "For visits to Hanle, Umling La, Tso Moriri, Tso Kar, and other areas within or near protected or restricted regions, access is subject to prevailing permit, security, wildlife, environmental, and route regulations. A destination may become inaccessible even after the itinerary has been confirmed.",

            "The package and quotation are prepared according to the requirements shared by the customer. The quotation remains customizable only until it is finalized. Once the package and quotation are confirmed, changes may be subject to availability and additional charges.",

            "If a customer chooses not to use any of the confirmed services after commencement of the tour, the customer will remain liable for the amount specified in the confirmed voucher or payment schedule. Unused services are not automatically eligible for a refund.",

            "Customers are advised not to modify the confirmed tour plan during the trip. If the number of travel days is reduced after commencement of the tour, the total confirmed package price will not automatically be reduced.",

            "Any sightseeing location, route, permit, activity, service, or transportation not included in the final confirmed quotation or itinerary will be treated as an additional service and may attract additional charges. Such additions are subject to permits, availability, local regulations, weather conditions, and operational feasibility.",

            "If a customer chooses to terminate or discontinue the tour before the scheduled completion date, the applicable charges and payment obligations will be governed by the confirmed voucher and cancellation policy.",

            "We take reasonable care in providing transportation, drivers, hotels, and other confirmed services. Customers are expected to treat drivers, hotel staff, guides, local service providers, and other service partners respectfully. In case of any service-related concern, customers should contact us promptly so that we can assist in resolving the issue.",

            "If payment is not made according to the agreed payment schedule or confirmed voucher, the service provider reserves the right to suspend or terminate the pending services, subject to the applicable terms and circumstances.",

            "The service provider will not be responsible for loss, theft, damage, or misplacement of personal belongings. Customers are responsible for keeping their valuables and personal belongings secure throughout the tour.",

            "Mobile connectivity, internet access, banking facilities, fuel availability, medical facilities, and other essential services may be limited or unavailable in remote areas of Ladakh. Customers should plan accordingly and carry sufficient essentials for remote-area travel.",

            "During periods of extreme cold, particularly in high-altitude and remote areas, vehicle operation, hotel facilities, water supply, heating, and other services may be affected by freezing temperatures, power interruptions, weather conditions, or infrastructure limitations.",

            "Air-conditioning is generally not required in Ladakh due to the prevailing climate and may not be operated in the vehicle. Heating facilities, where available, are subject to the vehicle and accommodation provided and local operating conditions.",

            "For any assistance or service-related concern before or during the tour, please contact the contact details provided in your itinerary or voucher. Our team will make reasonable efforts to assist and resolve the issue at the earliest.",


        ],

    },
];