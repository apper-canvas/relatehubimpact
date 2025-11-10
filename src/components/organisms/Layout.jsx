import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import QuoteModal from "@/components/organisms/QuoteModal";
import { contactService } from "@/services/api/contactService";
import { dealService } from "@/services/api/dealService";
import { taskService } from "@/services/api/taskService";
import { quoteService } from "@/services/api/quoteService";
import { activityService } from "@/services/api/activityService";
import { alertService } from "@/services/api/alertService";
import ContactModal from "@/components/organisms/ContactModal";
import Header from "@/components/organisms/Header";
import TaskModal from "@/components/organisms/TaskModal";
import DealModal from "@/components/organisms/DealModal";
const Layout = () => {
  const [modals, setModals] = useState({
    contact: { isOpen: false, data: null },
    deal: { isOpen: false, data: null },
    task: { isOpen: false, data: null },
    quote: { isOpen: false, data: null }
  });

  const openModal = (type, data = null) => {
    setModals(prev => ({
      ...prev,
      [type]: { isOpen: true, data }
    }));
  };

  const closeModal = (type) => {
    setModals(prev => ({
      ...prev,
      [type]: { isOpen: false, data: null }
    }));
  };

  const handleSaveContact = async (contactData) => {
    try {
      const contact = modals.contact.data;
      
      if (contact) {
        await contactService.update(contact.Id, contactData);
        await activityService.create({
          contactId: contact.Id,
          dealId: null,
          type: "note",
          description: `Contact updated: ${contactData.name}`,
          timestamp: new Date().toISOString(),
        });
      } else {
        const newContact = await contactService.create(contactData);
        await activityService.create({
          contactId: newContact.Id,
          dealId: null,
          type: "note",
          description: `New contact added: ${contactData.name}`,
          timestamp: new Date().toISOString(),
        });
      }
      closeModal('contact');
    } catch (error) {
      console.error('Error saving contact:', error);
    }
  };

  const handleSaveDeal = async (dealData) => {
    try {
      const deal = modals.deal.data;
      
      if (deal) {
        await dealService.update(deal.Id, dealData);
        await activityService.create({
          contactId: parseInt(dealData.contactId),
          dealId: deal.Id,
          type: "deal",
          description: `Deal updated: ${dealData.title} - $${dealData.value}`,
          timestamp: new Date().toISOString(),
        });
      } else {
        const newDeal = await dealService.create(dealData);
        await activityService.create({
          contactId: parseInt(dealData.contactId),
          dealId: newDeal.Id,
          type: "deal",
          description: `New deal created: ${dealData.title} - $${dealData.value}`,
          timestamp: new Date().toISOString(),
        });
      }
      closeModal('deal');
    } catch (error) {
      console.error('Error saving deal:', error);
    }
  };

  const handleSaveTask = async (taskData) => {
    try {
      const task = modals.task.data;
      if (task) {
        await taskService.update(task.Id, taskData);
        await activityService.create({
          contactId: parseInt(taskData.contactId),
          dealId: null,
          type: "task",
          description: `Task updated: ${taskData.title}`,
          timestamp: new Date().toISOString(),
        });
      } else {
        await taskService.create(taskData);
        await activityService.create({
          contactId: parseInt(taskData.contactId),
          dealId: null,
          type: "task",
          description: `New task created: ${taskData.title}`,
          timestamp: new Date().toISOString(),
        });
      }
      closeModal('task');
    } catch (error) {
      console.error('Error saving task:', error);
    }
  };

  const handleSaveQuote = async (quoteData) => {
    try {
      const quote = modals.quote.data;
      if (quote) {
        await quoteService.update(quote.Id, quoteData);
      } else {
        await quoteService.create(quoteData);
      }
      closeModal('quote');
    } catch (error) {
      console.error('Error saving quote:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        onAddContact={() => openModal("contact")}
        onAddDeal={() => openModal("deal")}
        onAddTask={() => openModal("task")}
        onAddQuote={() => openModal("quote")}
      />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet 
          context={{
            openContactModal: (data) => openModal('contact', data),
            openDealModal: (data) => openModal('deal', data),
            openTaskModal: (data) => openModal('task', data),
            openQuoteModal: (data) => openModal('quote', data)
          }}
        />
      </main>

      <ContactModal
        isOpen={modals.contact.isOpen}
        onClose={() => closeModal('contact')}
        contact={modals.contact.data}
        onSave={handleSaveContact}
      />

      <DealModal
        isOpen={modals.deal.isOpen}
        onClose={() => closeModal("deal")}
        deal={modals.deal.data}
        onSave={handleSaveDeal}
      />

      <TaskModal
        isOpen={modals.task.isOpen}
        onClose={() => closeModal("task")}
        task={modals.task.data}
        onSave={handleSaveTask}
      />

      <QuoteModal
        isOpen={modals.quote.isOpen}
        onClose={() => closeModal('quote')}
        quote={modals.quote.data}
        onSave={handleSaveQuote}
      />
    </div>
  );
};

export default Layout;