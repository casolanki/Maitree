using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.DTOs;
using API.Entities;
using API.Helpers;

namespace API.Interface
{
    public interface IMessageRepository
    {
        void AddGroup(Group group);
        void RemoveConnection(Connection connection);
        Task<Connection> GetConnection(string connectionId);
        Task<Group> GetMessageGroup(string groupName);

        Task<Group> GetGroupForConnection(string connectionId);
        void AddMessasge(Message message);
        void DeleteMessasge(Message message);
        Task<Message> GetMessasge(int id);
        Task<PagedList<MessageDto>> GetMessasgeForUser(MessageParams messageParams);
        Task<IEnumerable<MessageDto>> GetMessasgeThread(string currentUsername, string recipientUsername);
        
    }
}