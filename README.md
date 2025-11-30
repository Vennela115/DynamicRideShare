🚗 **Dynamic Ride-Sharing and Carpooling Platform**


A full-stack web application that connects drivers and passengers traveling along similar routes — promoting cost-effective, eco-friendly, and community-driven transportation.
This platform makes daily commuting smarter with features like real-time ride search, secure payments, and dynamic fare calculation.

---



🌍 **Overview**

- The Dynamic Ride-Sharing and Carpooling Platform is built to make urban commuting smarter, safer, and more sustainable.


- Drivers can create and manage rides, while passengers can search, book, and pay securely for shared rides in real time.


- Admins can monitor the system with a dedicated dashboard for user and ride management.

- This project highlights the power of modern web technologies in building scalable, secure, and socially impactful mobility solutions.

---


⚙️ **Features**



🔐 Security & Authentication

  -> JWT-based authentication for secure login and sessions

  -> Role-based access (Admin / Driver / Passenger)

  -> Passwords securely hashed using bcrypt




🚘 Ride Management

  -> Drivers can create, update, or cancel rides

  -> Passengers can search and book rides in real time

  -> Admin can manage users and rides





💳 Payment & Fare System

  -> Razorpay integration for online payments

  -> OpenRouteService API for dynamic, distance-based fare calculation




💬 Real-Time Communication

  -> WebSocket-based notifications (booking confirmations, cancellations, etc.)

  -> Email notifications for important updates




🖥️ Responsive UI

  -> Built with ReactJS + Tailwind CSS

  -> Mobile-friendly design for smooth cross-device experience



🧾 Admin Dashboard

  -> User and ride management

  -> Transaction monitoring

  -> System performance analytics


---


💻 **Tech Stack**


**Layer  :	Technologies Used**


Frontend :	ReactJS, Tailwind CSS, Axios


Backend :	Spring Boot (Java)


Database :	MySQL


Authentication :	Spring Security + JWT


Payments :	Razorpay API


Mapping & Distance :	OpenRouteService API


Testing Tools :	Postman, Browser Testing



Version Control :	Git & GitHub

---


🧠 **System Architecture**

- Frontend (ReactJS + Tailwind)

        
        
- RESTful API (Spring Boot)

        
        
- Database (MySQL)

        
        
- Payment Gateway (Razorpay)


        
        
- Map & Route Service (OpenRouteService)

---

🧩 **Modules**

👥 User Module

 - Registration, Login, and Profile management

 - Role-based access control

🚗 Driver Module

 - Create, update, and manage rides

 - Set available seats and fare

🧍 Passenger Module

 - Search and book available rides

 - Make secure payments

🛠️ Admin Module

 - Manage all users and rides

 - Monitor transactions

 - Remove inactive or fraudulent accounts

---

🗃️ **Database Design**

**Key Tables**

users – stores user credentials and roles

rides – details like source, destination, fare, available seats

bookings – connects users and rides

payments – transaction records

reviews – user feedback

**Relationships**

One-to-Many → A driver can create multiple rides

Many-to-Many → Passengers can book multiple rides


--- 

🖼️ **Screenshots**

**Feature Screenshot**



- Landing Page	🖥️ Home interface with navigation






<img width="1347" height="632" alt="image" src="https://github.com/user-attachments/assets/e7a18ee5-f3ea-4acd-a839-6ab68188206a" />







- Driver Registration	🚘 Create driver account




<img width="988" height="460" alt="image" src="https://github.com/user-attachments/assets/19dcd368-c6d1-4124-8bb9-ec1babdf1158" />











- Ride Search	🔍 Passenger searching rides





<img width="1150" height="530" alt="image" src="https://github.com/user-attachments/assets/2bf18938-a933-488a-8b53-3eeb63e05e29" />








- Payment	💳 Razorpay payment screen




<img width="1150" height="527" alt="image" src="https://github.com/user-attachments/assets/9c005209-b922-48ac-8a78-8b4752cb2367" />



- Admin Dashboard	🧾 Manage users, rides, and payments







<img width="991" height="456" alt="image" src="https://github.com/user-attachments/assets/baeefac1-cada-4954-b245-7608dd64a172" />



---
🧪 **Testing**

- Frontend: Tested on Chrome, Firefox, and Edge for responsiveness

- Backend: Tested using Postman for API validation

- Performance: Verified under concurrent ride bookings and high traffic

- Security: Checked JWT expiry, unauthorized access, and data encryption


---

🚀 **Future Enhancements**

✅ AI-Powered Ride Recommendations – Smart suggestions based on travel history


✅ Mobile App (React Native / Flutter) – On-the-go accessibility


✅ Real-Time Ride Tracking – GPS-based live driver location



✅ Wallet & Rewards System – Faster transactions and loyalty points


✅ OTP-Based Ride Verification – Enhanced safety


✅ In-App Chat – Real-time communication between driver and passenger


✅ Multi-Language Support – Accessibility for diverse users


✅ Eco-Mode Tracker – Display CO₂ saved through shared rides


---

🧭 **Installation Guide**


Clone the Repository

git clone https://github.com/Pradeep0997/RideShare.git
cd RideShare


Setup Backend

cd backend
mvn clean install
mvn spring-boot:run


Setup Frontend

cd frontend
npm install
npm start


Access the Application

http://localhost:3000

--- 


👨‍💻 **Contributors**


Settipalle Pradeep Reddy 


@Pradeep0997


---


📜 **License**

This project is open-source and available under the MIT License
