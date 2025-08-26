import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Flag, Globe, Crown, ArrowRight, CheckCircle, Clock, Target } from 'lucide-react';

const HomePage = () => {
  const subjects = [
    {
      path: '/apush',
      title: 'AP US History',
      icon: <Flag className="w-12 h-12 text-indigo-600" />,
      description: 'Master your APUSH terms with comprehensive quizzes covering all periods of American history.',
      gradient: 'from-indigo-500 to-blue-600',
      bgColor: 'bg-indigo-50'
    },
    {
      path: '/ap-world',
      title: 'AP World History',
      icon: <Globe className="w-12 h-12 text-green-600" />,
      description: 'Explore global historical terms and concepts from ancient civilizations to modern times.',
      gradient: 'from-green-500 to-emerald-600',
      bgColor: 'bg-green-50'
    },
    {
      path: '/ap-euro',
      title: 'AP European History',
      icon: <Crown className="w-12 h-12 text-purple-600" />,
      description: 'Study European history terms from the Renaissance through modern European developments.',
      gradient: 'from-purple-500 to-violet-600',
      bgColor: 'bg-purple-50'
    }
  ];

  const features = [
    {
      icon: <Target className="w-8 h-8 text-blue-600" />,
      title: 'Scoring',
      description: 'Scoring that understands partial answers and gives detailed feedback.'
    },
    {
      icon: <CheckCircle className="w-8 h-8 text-green-600" />,
      title: 'Multiple Quiz Modes',
      description: 'Practice individual fields (Who, What, Where, When, Why) or take comprehensive identification quizzes.'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Hero Section */}
      <div className="max-w-6xl mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <div className="flex items-center justify-center mb-6">
            <BookOpen className="w-16 h-16 text-blue-600 mr-4" />
            <h1 className="text-5xl font-bold text-gray-800">AP Terms Quiz Hub</h1>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Master your AP History terms 
            Choose your subject and start practicing today.
          </p>
        </div>

        {/* Subject Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {subjects.map((subject) => (
            <Link
              key={subject.path}
              to={subject.path}
              className="group bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 overflow-hidden"
            >
              <div className={`${subject.bgColor} p-8 text-center`}>
                <div className="mb-4">
                  {subject.icon}
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-3">{subject.title}</h3>
                <p className="text-gray-600 leading-relaxed">{subject.description}</p>
              </div>
              <div className={`bg-gradient-to-r ${subject.gradient} p-4 text-center`}>
                <span className="text-white font-medium flex items-center justify-center">
                  Start Quiz
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </span>
              </div>
            </Link>
          ))}
        </div>

        {/* Features Section */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-16">
  <h2 className="text-3xl font-bold text-gray-800 text-center mb-12">Why Choose Our Quiz Platform?</h2>
  <div className="flex flex-wrap justify-center gap-8">
    {features.map((feature, index) => (
      <div key={index} className="text-center max-w-sm">
        <div className="flex justify-center mb-4">
          {feature.icon}
        </div>
        <h3 className="text-xl font-semibold text-gray-800 mb-3">{feature.title}</h3>
        <p className="text-gray-600">{feature.description}</p>
      </div>
    ))}
  </div>
</div>
      </div>
    </div>
  );
};

export default HomePage;