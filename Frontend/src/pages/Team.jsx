import TeamMember from "../Components/TeamMember";

// Placeholder image URLs - replace with actual images
const johnImageUrl = "https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=256&q=80";
const janeImageUrl = "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=256&q=80";
const michaelImageUrl = "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=256&q=80";
const emilyImageUrl = "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=256&q=80";

const Team = () => {
  // Team member data
  const teamMembers = [
    {
      id: 1,
      name: "John Smith",
      title: "CEO and Founder",
      experience: "10+ years of experience in digital marketing. Expertise in SEO, PPC, and content strategy",
      photo: johnImageUrl
    },
    {
      id: 2,
      name: "Jane Doe",
      title: "Director of Operations",
      experience: "7+ years of experience in project management and team leadership. Strong organizational and communication skills",
      photo: janeImageUrl
    },
    {
      id: 3,
      name: "Michael Brown",
      title: "Senior SEO Specialist",
      experience: "5+ years of experience in SEO and content creation. Proficient in keyword research and on-page optimization",
      photo: michaelImageUrl
    },
    {
      id: 4,
      name: "Emily Johnson",
      title: "PPC Manager",
      experience: "3+ years of experience in paid search advertising. Skilled in campaign management and optimization",
      photo: emilyImageUrl
    }
  ];

  return (
    <div className="bg-white p-4 md:p-8 max-w-6xl mx-auto relative">
      {/* Decorative radial lines */}
      <div className="radial-lines"></div>
      
      <div className="mb-6 flex items-center gap-6 ">
        <div className="inline-block bg-[#B4FF4A] px-4 py-2 rounded-lg mb-1">
          <h1 className="text-2xl font-bold">Team</h1>
        </div>
        <p className="text-gray-800 max-w-2xl text-md font-semibold">
          Meet the skilled and experienced team behind our successful digital marketing strategies
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        {teamMembers.map((member) => (
          <TeamMember
            key={member.id}
            name={member.name}
            title={member.title}
            experience={member.experience}
            photo={member.photo}
          />
        ))}
      </div>
    </div>
  );
};

export default Team;